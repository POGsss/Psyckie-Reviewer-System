const express = require("express");
const {
  getMaterials,
  getMaterialById,
} = require("../controllers/materialController");

const router = express.Router();

router.get("/", getMaterials);
router.get("/:id", getMaterialById);

module.exports = router;
