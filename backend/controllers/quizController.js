const asyncHandler = require("../utils/asyncHandler");
const {
  createQuestions,
  createQuiz,
  getAll,
  getById,
} = require("../models/quizModel");
const { getAll: getMaterials } = require("../models/materialModel");
const { getById: getTopicById } = require("../models/topicModel");

const MAX_GENERATED_QUESTIONS = 10;

const getQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await getAll({ topicId: req.query.topic_id });
  res.json({ quizzes });
});

const getQuizById = asyncHandler(async (req, res) => {
  const quiz = await getById(req.params.id);
  if (!quiz) {
    res.status(404);
    throw new Error("Quiz not found");
  }

  res.json({ quiz });
});

const extractJsonArray = (text) => {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini did not return a quiz question array");
  }

  return JSON.parse(text.slice(start, end + 1));
};

const normalizeGeneratedQuestions = (items) =>
  items
    .map((item, index) => {
      const options = Array.isArray(item.options)
        ? item.options.map((option) => String(option).trim()).filter(Boolean)
        : [];
      const correctAnswer = String(item.correct_answer || "").trim();

      return {
        question_text: String(item.question_text || item.question || "").trim(),
        options,
        correct_answer: correctAnswer,
        explanation: String(item.explanation || "").trim(),
        order_index: index + 1,
      };
    })
    .filter(
      (item) =>
        item.question_text &&
        item.options.length >= 2 &&
        item.correct_answer &&
        item.options.includes(item.correct_answer)
    );

const generateQuiz = asyncHandler(async (req, res) => {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const { topic_id, question_count } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    res.status(400);
    throw new Error("GEMINI_API_KEY is not configured");
  }

  if (!topic_id) {
    res.status(400);
    throw new Error("topic_id is required");
  }

  const topic = await getTopicById(topic_id, { userId: req.user.id });
  if (!topic) {
    res.status(404);
    throw new Error("Topic not found");
  }

  const materials = await getMaterials({ topicId: topic_id, userId: req.user.id });
  const sourceText = materials
    .map((material) => `Title: ${material.title}\n${material.content}`)
    .join("\n\n")
    .slice(0, 12000);

  if (!sourceText.trim()) {
    res.status(400);
    throw new Error("Add material content before generating a quiz");
  }

  const desiredCount = Math.min(
    Math.max(Number(question_count) || 5, 3),
    MAX_GENERATED_QUESTIONS
  );

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });

  const prompt = `
Create ${desiredCount} multiple-choice review questions for this psychology topic.
Return only a JSON array. Each item must have:
- question_text: string
- options: array of 4 short strings
- correct_answer: one exact string from options
- explanation: one concise review explanation

Topic: ${topic.title}
Materials:
${sourceText}
`;

  const result = await model.generateContent(prompt);
  const rawText = result.response.text();
  const generatedQuestions = normalizeGeneratedQuestions(extractJsonArray(rawText));

  if (generatedQuestions.length === 0) {
    res.status(422);
    throw new Error("Gemini did not produce usable quiz questions");
  }

  const quiz = await createQuiz({
    topicId: topic_id,
    title: `${topic.title} Generated Quiz`,
    totalQuestions: generatedQuestions.length,
  });

  const questions = await createQuestions(
    generatedQuestions.map((question) => ({
      ...question,
      quiz_id: quiz.id,
    }))
  );

  res.status(201).json({ quiz: { ...quiz, quiz_questions: questions } });
});

module.exports = { generateQuiz, getQuizzes, getQuizById };
