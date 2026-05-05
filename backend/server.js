const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const topicRoutes = require("./routes/topicRoutes");
const materialRoutes = require("./routes/materialRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const srsReviewRoutes = require("./routes/srsReviewRoutes");
const quizRoutes = require("./routes/quizRoutes");
const quizAttemptRoutes = require("./routes/quizAttemptRoutes");
const quizResponseRoutes = require("./routes/quizResponseRoutes");
const studySessionRoutes = require("./routes/studySessionRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/srs-reviews", srsReviewRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/quiz-attempts", quizAttemptRoutes);
app.use("/api/quiz-responses", quizResponseRoutes);
app.use("/api/study-sessions", studySessionRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Psyckie API running on port ${PORT}`);
});
