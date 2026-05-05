const asyncHandler = require("../utils/asyncHandler");
const { getAllByUser, createSession } = require("../models/studySessionModel");

const getStudySessions = asyncHandler(async (req, res) => {
  const sessions = await getAllByUser(req.user.id, {
    topicId: req.query.topic_id,
  });
  res.json({ sessions });
});

const createStudySession = asyncHandler(async (req, res) => {
  const { topic_id, started_at, ended_at, duration_minutes } = req.body;

  if (!topic_id) {
    res.status(400);
    throw new Error("topic_id is required");
  }

  const durationValue = Number(duration_minutes);

  const session = await createSession({
    userId: req.user.id,
    topicId: topic_id,
    startedAt: started_at,
    endedAt: ended_at,
    durationMinutes: Number.isFinite(durationValue) ? durationValue : undefined,
  });

  res.status(201).json({ session });
});

module.exports = { getStudySessions, createStudySession };
