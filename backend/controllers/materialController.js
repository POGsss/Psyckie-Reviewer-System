const asyncHandler = require("../utils/asyncHandler");
const { getAll, getById } = require("../models/materialModel");

const getMaterials = asyncHandler(async (req, res) => {
  const materials = await getAll({ topicId: req.query.topic_id });
  res.json({ materials });
});

const getMaterialById = asyncHandler(async (req, res) => {
  const material = await getById(req.params.id);
  if (!material) {
    res.status(404);
    throw new Error("Material not found");
  }

  res.json({ material });
});

module.exports = { getMaterials, getMaterialById };
