const asyncHandler = require("../utils/asyncHandler");
const {
  createCustomTopic,
  deleteCustomTopic,
  getAll,
  getById,
} = require("../models/topicModel");

const getTopics = asyncHandler(async (req, res) => {
  const topics = await getAll({ userId: req.user?.id });
  res.json({ topics });
});

const getTopicById = asyncHandler(async (req, res) => {
  const topic = await getById(req.params.id, { userId: req.user?.id });
  if (!topic) {
    res.status(404);
    throw new Error("Topic not found");
  }

  res.json({ topic });
});

const createTopic = asyncHandler(async (req, res) => {
  const { title, description, order_index, subject_area } = req.body;

  if (!title || !title.trim()) {
    res.status(400);
    throw new Error("Topic title is required");
  }

  const topic = await createCustomTopic({
    title: title.trim(),
    description: description?.trim() || null,
    orderIndex: Number.isFinite(Number(order_index)) ? Number(order_index) : 0,
    userId: req.user.id,
    subjectArea: subject_area?.trim() || "Custom",
  });

  res.status(201).json({ topic });
});

const deleteTopic = asyncHandler(async (req, res) => {
  const deleted = await deleteCustomTopic({
    id: req.params.id,
    userId: req.user.id,
  });

  if (!deleted) {
    res.status(404);
    throw new Error("Custom topic not found");
  }

  res.json({ message: "Topic deleted" });
});

module.exports = { createTopic, deleteTopic, getTopics, getTopicById };
