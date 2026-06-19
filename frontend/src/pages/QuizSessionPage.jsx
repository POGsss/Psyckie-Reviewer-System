import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../lib/api";
import MockIconUrl from "../assets/Mock.svg";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const formatTimer = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

const QuizSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "mock" ? "mock" : "practice";
  const isMock = mode === "mock";
  const startedKeyRef = useRef("");
  const submitRef = useRef(null);

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);

  useEffect(() => {
    let isMounted = true;

    const loadQuiz = async () => {
      const startKey = `${id}:${mode}`;
      if (startedKeyRef.current === startKey) {
        return;
      }

      startedKeyRef.current = startKey;
      setIsLoading(true);
      setError("");

      try {
        const quizResponse = await api.get(`/quizzes/${id}`);
        const loadedQuiz = quizResponse.data.quiz;
        const attemptResponse = await api.post("/quiz-attempts", {
          quiz_id: id,
          mode,
        });

        if (isMounted) {
          setQuiz(loadedQuiz);
          setAttempt(attemptResponse.data.attempt);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, "Unable to start this quiz."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadQuiz();

    return () => {
      isMounted = false;
    };
  }, [id, mode]);

  const questions = useMemo(() => quiz?.quiz_questions || [], [quiz]);
  const answeredCount = questions.filter((question) => answers[question.id])
    .length;
  const isComplete = questions.length > 0 && answeredCount === questions.length;

  const submitQuiz = useCallback(async () => {
    if (!attempt || isSubmitting) {
      return;
    }

    setSubmitError("");

    if (!isComplete) {
      setSubmitError("Answer every question before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post(`/quiz-attempts/${attempt.id}/submit`, {
        responses: questions.map((question) => ({
          question_id: question.id,
          user_answer: answers[question.id],
        })),
      });

      navigate(`/app/quiz/${id}/results?attempt_id=${attempt.id}`);
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Unable to submit this quiz."));
      setIsSubmitting(false);
    }
  }, [answers, attempt, id, isComplete, isSubmitting, navigate, questions]);

  useEffect(() => {
    submitRef.current = submitQuiz;
  }, [submitQuiz]);

  useEffect(() => {
    if (!isMock || !attempt) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          submitRef.current?.();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [attempt, isMock]);

  const handleAnswer = (questionId, option) => {
    setAnswers((current) => ({ ...current, [questionId]: option }));
  };

  if (isLoading) {
    return (
      <div className="rounded-[14px] bg-white p-6 text-[13.5px] text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        Starting quiz...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[14px] border border-red-200 bg-red-50 p-4 text-[13.5px] font-medium text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-[18px]">
      <section className="rounded-[14px] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-6">
        <Link
          to={quiz?.topic_id ? `/app/topics/${quiz.topic_id}` : "/app/mock"}
          className="mb-3 inline-flex text-[12.5px] font-semibold text-base-muted hover:text-brand-red"
        >
          Back
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[20px] font-bold text-base-text">
                {quiz?.title || "Quiz"}
              </h1>
              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-red">
                {isMock ? "Mock exam" : "Practice"}
              </span>
            </div>
            <p className="mt-1 text-[13.5px] text-base-muted">
              {quiz?.topics?.title || "Topic"} · {answeredCount}/
              {questions.length} answered
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-[10px] bg-base-bg px-3 py-2 text-[13px] font-bold text-base-text">
            <img src={MockIconUrl} width="16" height="16" alt="" />
            {isMock ? formatTimer(secondsLeft) : "Untimed"}
          </div>
        </div>
      </section>

      {submitError && (
        <div className="rounded-[14px] bg-red-50 px-4 py-3 text-[12.5px] font-medium text-red-700">
          {submitError}
        </div>
      )}

      {questions.map((question, index) => (
        <section
          key={question.id}
          className="rounded-[14px] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-6"
        >
          <div className="mb-4 flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-brand-red text-[13px] font-bold text-white">
              {index + 1}
            </span>
            <h2 className="pt-1 text-[15px] font-bold leading-6 text-base-text">
              {question.question_text}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(question.options || []).map((option) => {
              const isSelected = answers[question.id] === option;

              return (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center gap-3 rounded-[10px] border px-3.5 py-3 text-[13.5px] font-semibold transition-colors ${
                    isSelected
                      ? "border-brand-red bg-brand-soft text-brand-red"
                      : "border-base-border bg-white text-base-text hover:bg-base-bg"
                  }`}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={isSelected}
                    onChange={() => handleAnswer(question.id, option)}
                    className="h-4 w-4 accent-brand-red"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </section>
      ))}

      <section className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-6">
        <div className="text-[13px] font-semibold text-base-muted">
          {isComplete
            ? "Ready to submit."
            : `${questions.length - answeredCount} question${
                questions.length - answeredCount === 1 ? "" : "s"
              } left.`}
        </div>
        <button
          type="button"
          disabled={!isComplete || isSubmitting}
          onClick={submitQuiz}
          className="rounded-full bg-brand-red px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit Attempt"}
        </button>
      </section>
    </div>
  );
};

export default QuizSessionPage;
