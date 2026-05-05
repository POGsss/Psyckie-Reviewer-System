const asyncHandler = require("../utils/asyncHandler");
const { getAll, getById } = require("../models/topicModel");

const getTopics = asyncHandler(async (req, res) => {
  const topics = await getAll();
  res.json({ topics });
});

const getTopicById = asyncHandler(async (req, res) => {
  const topic = await getById(req.params.id);
  if (!topic) {
    res.status(404);
    throw new Error("Topic not found");
  }

  res.json({ topic });
});

module.exports = { getTopics, getTopicById };
