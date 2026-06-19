import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import MockIconUrl from "../assets/Mock.svg";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const MockExamPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadQuizzes = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [quizResponse, attemptResponse] = await Promise.all([
          api.get("/quizzes"),
          api.get("/quiz-attempts"),
        ]);

        if (isMounted) {
          setQuizzes(quizResponse.data.quizzes || []);
          setAttempts(attemptResponse.data.attempts || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, "Unable to load mock exams."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadQuizzes();

    return () => {
      isMounted = false;
    };
  }, []);

  const attemptsByQuiz = useMemo(() => {
    const grouped = new Map();
    attempts.forEach((attempt) => {
      if (!grouped.has(attempt.quiz_id)) {
        grouped.set(attempt.quiz_id, []);
      }
      grouped.get(attempt.quiz_id).push(attempt);
    });
    return grouped;
  }, [attempts]);

  const completedAttempts = attempts.filter((attempt) => attempt.completed_at);
  const averageScore =
    completedAttempts.length > 0
      ? Math.round(
          completedAttempts.reduce(
            (sum, attempt) => sum + Number(attempt.score || 0),
            0
          ) / completedAttempts.length
        )
      : 0;

  if (isLoading) {
    return (
      <div className="rounded-[14px] bg-white p-6 text-[13.5px] text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        Loading mock exams...
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
    <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-[1fr_320px]">
      <section className="space-y-[18px]">
        <div className="rounded-[14px] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] font-bold text-base-text">
                  Quiz and Mock Exam Mode
                </h1>
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-red">
                  Timed
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-[13.5px] leading-6 text-base-muted">
                Start practice when you want review feedback, or mock exam mode
                when you want a stricter timed run.
              </p>
            </div>
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] bg-red-100">
              <img src={MockIconUrl} width="20" height="20" alt="" />
            </div>
          </div>
        </div>

        {quizzes.length === 0 ? (
          <div className="rounded-[14px] bg-white p-6 text-[13.5px] text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            No quizzes are available yet. Run the backend seed script after
            applying the latest schema, or generate a topic quiz from materials.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {quizzes.map((quiz) => {
              const quizAttempts = attemptsByQuiz.get(quiz.id) || [];
              const latestCompleted = quizAttempts.find(
                (attempt) => attempt.completed_at
              );

              return (
                <article
                  key={quiz.id}
                  className="rounded-[14px] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[15px] font-bold text-base-text">
                          {quiz.title}
                        </h2>
                        <span className="rounded-full bg-base-bg px-2 py-[3px] text-[11px] font-semibold text-base-muted">
                          {quiz.total_questions} questions
                        </span>
                      </div>
                      <p className="mt-1 text-[12.5px] text-base-muted">
                        {quiz.topics?.title || "Topic"} ·{" "}
                        {quiz.topics?.subject_area || "BLEPP"}
                      </p>
                      {latestCompleted && (
                        <Link
                          to={`/app/quiz/${quiz.id}/results?attempt_id=${latestCompleted.id}`}
                          className="mt-3 inline-flex text-[12.5px] font-semibold text-brand-red"
                        >
                          Last score: {Number(latestCompleted.score || 0)}%
                        </Link>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/app/quiz/${quiz.id}`}
                        className="rounded-full bg-base-bg px-4 py-2 text-[12.5px] font-semibold text-base-muted transition-colors hover:bg-[#eaecef]"
                      >
                        Practice
                      </Link>
                      <Link
                        to={`/app/quiz/${quiz.id}?mode=mock`}
                        className="rounded-full bg-brand-red px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-dark"
                      >
                        Mock Exam
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <aside className="self-start rounded-[14px] bg-white p-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-6">
        <div className="mb-[18px]">
          <div className="text-[15px] font-bold text-base-text">
            Attempt Summary
          </div>
          <div className="mt-0.5 text-[12.5px] text-base-muted">
            Completed attempts are persisted server-side.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-[10px] bg-base-bg p-3 text-center">
            <div className="text-[24px] font-bold text-base-text">
              {completedAttempts.length}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-base-muted">
              Completed
            </div>
          </div>
          <div className="rounded-[10px] bg-base-bg p-3 text-center">
            <div className="text-[24px] font-bold text-base-text">
              {averageScore}%
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-base-muted">
              Average
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[10px] bg-brand-soft px-3 py-3 text-[12.5px] leading-5 text-brand-red">
          Mock exam mode uses the same scoring model as practice, with a timed
          session and no answer review until submission.
        </div>
      </aside>
    </div>
  );
};

export default MockExamPage;
