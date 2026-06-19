const express = require("express");
const {
  createMaterial,
  deleteMaterial,
  getMaterials,
  getMaterialById,
} = require("../controllers/materialController");
const { optionalAuth, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", optionalAuth, getMaterials);
router.post("/", protect, createMaterial);
router.get("/:id", optionalAuth, getMaterialById);
router.delete("/:id", protect, deleteMaterial);

module.exports = router;
