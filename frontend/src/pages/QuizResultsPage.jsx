import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import api from "../lib/api";
import MockIconUrl from "../assets/Mock.svg";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const QuizResultsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [attempt, setAttempt] = useState(null);
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadResults = async () => {
      setIsLoading(true);
      setError("");

      try {
        let attemptId = searchParams.get("attempt_id");

        if (!attemptId) {
          const { data } = await api.get("/quiz-attempts", {
            params: { quiz_id: id },
          });
          const completedAttempt = (data.attempts || []).find(
            (item) => item.completed_at
          );
          attemptId = completedAttempt?.id;
        }

        if (!attemptId) {
          throw new Error("No completed attempt found for this quiz.");
        }

        const { data } = await api.get(`/quiz-attempts/${attemptId}/results`);

        if (isMounted) {
          setAttempt(data.attempt);
          setResponses(data.responses || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, err.message || "Unable to load results."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadResults();

    return () => {
      isMounted = false;
    };
  }, [id, searchParams]);

  const correctCount = attempt?.correct_count ?? 0;
  const totalQuestions = attempt?.total_questions || responses.length || 0;
  const score = Number(attempt?.score || 0);
  const resultLabel = score >= 80 ? "Strong pass" : score >= 60 ? "Keep polishing" : "Review needed";

  const topicUrl = useMemo(() => {
    const topicId = attempt?.quizzes?.topic_id;
    return topicId ? `/app/topics/${topicId}` : "/app/mock";
  }, [attempt]);

  if (isLoading) {
    return (
      <div className="rounded-[14px] bg-white p-6 text-[13.5px] text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        Loading results...
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
      <section className="grid grid-cols-1 gap-4.5 lg:grid-cols-[1fr_300px]">
        <div className="rounded-[14px] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-6">
          <Link
            to={topicUrl}
            className="mb-3 inline-flex text-[12.5px] font-semibold text-base-muted hover:text-brand-red"
          >
            Back
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[20px] font-bold text-base-text">
                  {attempt?.quizzes?.title || "Quiz Results"}
                </h1>
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-red">
                  {attempt?.mode === "mock" ? "Mock exam" : "Practice"}
                </span>
              </div>
              <p className="mt-1 text-[13.5px] text-base-muted">
                {attempt?.quizzes?.topics?.title || "Topic"} · {resultLabel}
              </p>
            </div>
            <Link
              to={`/app/quiz/${id}?mode=${attempt?.mode || "practice"}`}
              className="rounded-full bg-brand-red px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Retake
            </Link>
          </div>
        </div>

        <div className="rounded-[14px] bg-brand-red p-3 text-white shadow-[0_2px_8px_rgba(232,37,42,0.25)] sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-semibold opacity-90">Score</span>
            <img
              src={MockIconUrl}
              width="18"
              height="18"
              alt=""
              className="invert"
            />
          </div>
          <div className="text-[44px] font-bold leading-none">{score}%</div>
          <div className="mt-2 text-[13px] opacity-85">
            {correctCount} of {totalQuestions} correct
          </div>
        </div>
      </section>

      <section className="rounded-[14px] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-[15px] font-bold text-base-text">
              Answer Review
            </div>
            <div className="mt-0.5 text-[12.5px] text-base-muted">
              Your submitted answers remain available after refresh.
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {responses.map((response, index) => (
            <article
              key={response.id}
              className="rounded-[10px] bg-base-bg px-3.5 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="max-w-2xl text-[14px] font-bold leading-5 text-base-text">
                  {index + 1}. {response.question}
                </h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    response.is_correct
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {response.is_correct ? "Correct" : "Review"}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-[8px] bg-white px-3 py-2 text-[13px]">
                  <span className="font-semibold text-base-muted">
                    Your answer:
                  </span>{" "}
                  <span className="font-semibold text-base-text">
                    {response.user_answer || "No answer"}
                  </span>
                </div>
                <div className="rounded-[8px] bg-white px-3 py-2 text-[13px]">
                  <span className="font-semibold text-base-muted">
                    Correct answer:
                  </span>{" "}
                  <span className="font-semibold text-base-text">
                    {response.correct_answer}
                  </span>
                </div>
              </div>
              {response.explanation && (
                <p className="mt-3 text-[13px] leading-5 text-base-muted">
                  {response.explanation}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default QuizResultsPage;
