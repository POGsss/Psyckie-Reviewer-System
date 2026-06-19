import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import BrainIconUrl from "../assets/Brain.svg";
import FlashcardsIconUrl from "../assets/Flashcards.svg";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const ratingOptions = [
  {
    value: "again",
    label: "Again",
    detail: "10 min",
    className: "bg-red-50 text-red-700 hover:bg-red-100",
  },
  {
    value: "hard",
    label: "Hard",
    detail: "Soon",
    className: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  {
    value: "good",
    label: "Good",
    detail: "Next",
    className: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  },
  {
    value: "easy",
    label: "Easy",
    detail: "Later",
    className: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
];

const formatDueDate = (value) => {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const ReviewPage = () => {
  const sessionStartedAt = useRef(new Date().toISOString());
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewedCards, setReviewedCards] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDueCards = async () => {
      setIsLoading(true);
      setError("");

      try {
        const { data } = await api.get("/srs-reviews/due");
        if (isMounted) {
          setQueue(data.reviews || []);
          setCurrentIndex(0);
          setReviewedCards([]);
          setSummary(null);
          sessionStartedAt.current = new Date().toISOString();
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, "Unable to load review queue."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDueCards();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentReview = queue[currentIndex];
  const currentFlashcard = currentReview?.flashcards;
  const progressPercent = queue.length
    ? Math.round((reviewedCards.length / queue.length) * 100)
    : 0;

  const ratingCounts = useMemo(
    () =>
      reviewedCards.reduce((counts, item) => {
        counts[item.rating] = (counts[item.rating] || 0) + 1;
        return counts;
      }, {}),
    [reviewedCards]
  );

  const finishSession = async (cards) => {
    if (!cards.length) {
      return null;
    }

    const endedAt = new Date().toISOString();
    const durationMinutes = Math.max(
      1,
      Math.round(
        (new Date(endedAt) - new Date(sessionStartedAt.current)) / 60000
      )
    );

    const { data } = await api.post("/srs-reviews/sessions/finish", {
      reviewed_review_ids: cards.map((item) => item.id),
      started_at: sessionStartedAt.current,
      ended_at: endedAt,
      duration_minutes: durationMinutes,
    });

    return data.summary;
  };

  const completeSession = async (cards) => {
    const sessionSummary = await finishSession(cards);
    setSummary({
      reviewed_count: cards.length,
      duration_minutes: sessionSummary?.duration_minutes || 1,
      topic_count: sessionSummary?.topic_count || 0,
    });
  };

  const handleRate = async (rating) => {
    if (!currentReview || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { data } = await api.post(`/srs-reviews/${currentReview.id}/rate`, {
        rating,
      });

      const nextReviewedCards = [
        ...reviewedCards,
        {
          id: currentReview.id,
          rating,
          question: currentFlashcard?.question || "Flashcard",
          topic: currentFlashcard?.topics?.title || "Topic",
          next_due_at: data.review?.due_at,
        },
      ];

      setReviewedCards(nextReviewedCards);

      if (currentIndex < queue.length - 1) {
        setCurrentIndex((index) => index + 1);
        setShowAnswer(false);
      } else {
        await completeSession(nextReviewedCards);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Unable to submit that rating."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishEarly = async () => {
    if (reviewedCards.length === 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await completeSession(reviewedCards);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to finish this session."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-[14px] bg-white p-6 text-[13.5px] text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        Loading review queue...
      </div>
    );
  }

  if (error && !currentReview && !summary) {
    return (
      <div className="rounded-[14px] border border-red-200 bg-red-50 p-4 text-[13.5px] font-medium text-red-700">
        {error}
      </div>
    );
  }

  if (summary) {
    return (
      <div className="mx-auto max-w-[760px] space-y-4">
        <section className="rounded-[14px] bg-white p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-brand-soft">
            <img src={BrainIconUrl} width="26" height="26" alt="" />
          </div>
          <h1 className="text-[24px] font-bold text-base-text">
            Review Complete
          </h1>
          <p className="mx-auto mt-2 max-w-[460px] text-[13.5px] leading-6 text-base-muted">
            Your SRS schedule has been updated and this review session was added
            to your study activity.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-[10px] bg-base-bg p-3">
              <div className="text-[24px] font-bold text-base-text">
                {summary.reviewed_count}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-base-muted">
                Cards
              </div>
            </div>
            <div className="rounded-[10px] bg-base-bg p-3">
              <div className="text-[24px] font-bold text-base-text">
                {summary.duration_minutes}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-base-muted">
                Minutes
              </div>
            </div>
            <div className="rounded-[10px] bg-base-bg p-3">
              <div className="text-[24px] font-bold text-base-text">
                {summary.topic_count}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-base-muted">
                Topics
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              to="/app"
              className="rounded-full bg-brand-red px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/app/flashcards"
              className="rounded-full bg-base-bg px-5 py-2.5 text-[13.5px] font-semibold text-base-muted transition-colors hover:bg-[#eaecef]"
            >
              Manage Flashcards
            </Link>
          </div>
        </section>

        <section className="rounded-[14px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-5">
          <div className="mb-3 text-[15px] font-bold text-base-text">
            Session Ratings
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ratingOptions.map((option) => (
              <div key={option.value} className="rounded-[10px] bg-base-bg p-3">
                <div className="text-[13px] font-semibold text-base-text">
                  {option.label}
                </div>
                <div className="text-[22px] font-bold text-brand-red">
                  {ratingCounts[option.value] || 0}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="mx-auto max-w-[720px] rounded-[14px] bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] bg-brand-soft">
          <img src={FlashcardsIconUrl} width="26" height="26" alt="" />
        </div>
        <h1 className="text-[22px] font-bold text-base-text">
          All caught up
        </h1>
        <p className="mx-auto mt-2 max-w-[420px] text-[13.5px] leading-6 text-base-muted">
          No cards are due right now. New flashcards will enter your review
          queue automatically.
        </p>
        <Link
          to="/app/flashcards"
          className="mt-5 inline-flex rounded-full bg-brand-red px-5 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Add Flashcards
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[820px] space-y-4">
      <section className="rounded-[14px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[15px] font-bold text-base-text">
              Daily Review
            </div>
            <div className="mt-0.5 text-[12.5px] text-base-muted">
              {reviewedCards.length} of {queue.length} cards reviewed
            </div>
          </div>
          <button
            type="button"
            onClick={handleFinishEarly}
            disabled={reviewedCards.length === 0 || isSubmitting}
            className="rounded-full bg-base-bg px-4 py-2 text-[12.5px] font-semibold text-base-muted transition-colors hover:bg-[#eaecef] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Finish Session
          </button>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-base-bg">
          <div
            className="h-full rounded-full bg-brand-red transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {error && (
        <div className="rounded-[14px] bg-red-50 px-4 py-3 text-[12.5px] font-medium text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-[14px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-wider text-base-muted">
              {currentFlashcard?.topics?.title || "Review Card"}
            </div>
            <h1 className="mt-2 text-[22px] font-bold leading-7 text-base-text sm:text-[26px] sm:leading-8">
              {currentFlashcard?.question}
            </h1>
          </div>
          <span className="rounded-full bg-brand-soft px-3 py-1 text-[12px] font-semibold text-brand-red">
            Due {formatDueDate(currentReview?.due_at)}
          </span>
        </div>

        <div className="min-h-[180px] rounded-[12px] border border-base-border bg-base-bg p-4 sm:p-5">
          {showAnswer ? (
            <p className="whitespace-pre-line text-[15px] leading-7 text-base-text">
              {currentFlashcard?.answer}
            </p>
          ) : (
            <div className="flex min-h-[140px] items-center justify-center text-center text-[13.5px] font-medium text-base-muted">
              Try recalling the answer before revealing it.
            </div>
          )}
        </div>

        {!showAnswer ? (
          <button
            type="button"
            onClick={() => setShowAnswer(true)}
            className="mt-4 w-full rounded-full bg-brand-red px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Reveal Answer
          </button>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {ratingOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={isSubmitting}
                onClick={() => handleRate(option.value)}
                className={`rounded-[10px] px-3 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${option.className}`}
              >
                <span className="block text-[14px] font-bold">
                  {option.label}
                </span>
                <span className="mt-1 block text-[12px] font-semibold opacity-80">
                  {option.detail}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ReviewPage;
