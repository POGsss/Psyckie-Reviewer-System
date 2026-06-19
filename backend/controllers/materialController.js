const asyncHandler = require("../utils/asyncHandler");
const {
  createMaterial: insertMaterial,
  deleteMaterial: deleteOwnedMaterial,
  getAll,
  getById,
} = require("../models/materialModel");
const { getById: getTopicById } = require("../models/topicModel");

const getMaterials = asyncHandler(async (req, res) => {
  const materials = await getAll({
    topicId: req.query.topic_id,
    userId: req.user?.id,
  });
  res.json({ materials });
});

const getMaterialById = asyncHandler(async (req, res) => {
  const material = await getById(req.params.id, { userId: req.user?.id });
  if (!material) {
    res.status(404);
    throw new Error("Material not found");
  }

  res.json({ material });
});

const createMaterial = asyncHandler(async (req, res) => {
  const {
    topic_id,
    title,
    content,
    content_type = "markdown",
    source_url,
  } = req.body;

  if (!topic_id) {
    res.status(400);
    throw new Error("Topic is required");
  }

  if (!title || !title.trim()) {
    res.status(400);
    throw new Error("Material title is required");
  }

  if (!content || !content.trim()) {
    res.status(400);
    throw new Error("Material content is required");
  }

  const topic = await getTopicById(topic_id, { userId: req.user.id });
  if (!topic) {
    res.status(404);
    throw new Error("Topic not found");
  }

  const material = await insertMaterial({
    topicId: topic_id,
    userId: req.user.id,
    title: title.trim(),
    content: content.trim(),
    contentType: content_type,
    sourceUrl: source_url?.trim(),
  });

  res.status(201).json({ material });
});

const deleteMaterial = asyncHandler(async (req, res) => {
  const deleted = await deleteOwnedMaterial({
    id: req.params.id,
    userId: req.user.id,
  });

  if (!deleted) {
    res.status(404);
    throw new Error("Material not found");
  }

  res.json({ message: "Material deleted" });
});

module.exports = {
  createMaterial,
  deleteMaterial,
  getMaterials,
  getMaterialById,
};
