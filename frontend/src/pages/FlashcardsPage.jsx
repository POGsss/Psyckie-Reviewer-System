import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api";
import useAuthStore from "../store/authStore";
import FlashcardsIconUrl from "../assets/Flashcards.svg";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const difficultyLabels = {
  1: "Warm-up",
  2: "Light",
  3: "Medium",
  4: "Hard",
  5: "Mastery",
};

const emptyForm = {
  topic_id: "",
  question: "",
  answer: "",
  difficulty: "1",
};

const FlashcardsPage = () => {
  const { id: routeTopicId } = useParams();
  const user = useAuthStore((state) => state.user);
  const [topic, setTopic] = useState(null);
  const [topics, setTopics] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    ...emptyForm,
    topic_id: routeTopicId || "",
  });
  const [editForm, setEditForm] = useState(emptyForm);

  useEffect(() => {
    let isMounted = true;

    const loadFlashcards = async () => {
      setIsLoading(true);
      setError("");
      setFormError("");
      setEditingId(null);

      try {
        const requests = routeTopicId
          ? [
              api.get(`/topics/${routeTopicId}`),
              api.get("/flashcards", { params: { topic_id: routeTopicId } }),
            ]
          : [api.get("/topics"), api.get("/flashcards")];

        const [firstResponse, flashcardsResponse] = await Promise.all(requests);

        if (!isMounted) {
          return;
        }

        if (routeTopicId) {
          setTopic(firstResponse.data.topic);
          setTopics([]);
          setForm({ ...emptyForm, topic_id: routeTopicId });
        } else {
          const loadedTopics = firstResponse.data.topics || [];
          setTopic(null);
          setTopics(loadedTopics);
          setForm({
            ...emptyForm,
            topic_id: loadedTopics[0]?.id || "",
          });
        }

        setFlashcards(flashcardsResponse.data.flashcards || []);
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, "Unable to load flashcards."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFlashcards();

    return () => {
      isMounted = false;
    };
  }, [routeTopicId]);

  const ownedCount = useMemo(
    () => flashcards.filter((card) => card.user_id === user?.id).length,
    [flashcards, user?.id]
  );

  const selectedTopicTitle = routeTopicId
    ? topic?.title
    : topics.find((item) => item.id === form.topic_id)?.title;

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((current) => ({ ...current, [name]: value }));
  };

  const validateCard = ({ topic_id, question, answer }) => {
    if (!topic_id) {
      return "Choose a topic before saving.";
    }

    if (!question.trim()) {
      return "Add a flashcard question first.";
    }

    if (!answer.trim()) {
      return "Add the answer before saving.";
    }

    return "";
  };

  const handleCreateFlashcard = async (event) => {
    event.preventDefault();
    setFormError("");

    const validationError = validateCard(form);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSaving(true);

    try {
      const { data } = await api.post("/flashcards", {
        topic_id: routeTopicId || form.topic_id,
        question: form.question,
        answer: form.answer,
        difficulty: form.difficulty,
      });
      setFlashcards((current) => [data.flashcard, ...current]);
      setForm({
        ...emptyForm,
        topic_id: routeTopicId || form.topic_id,
      });
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to save that flashcard."));
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (flashcard) => {
    setFormError("");
    setEditingId(flashcard.id);
    setEditForm({
      topic_id: flashcard.topic_id,
      question: flashcard.question,
      answer: flashcard.answer,
      difficulty: String(flashcard.difficulty || 1),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleUpdateFlashcard = async (event, flashcardId) => {
    event.preventDefault();
    setFormError("");

    const validationError = validateCard(editForm);
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const { data } = await api.put(`/flashcards/${flashcardId}`, {
        question: editForm.question,
        answer: editForm.answer,
        difficulty: editForm.difficulty,
      });
      setFlashcards((current) =>
        current.map((flashcard) =>
          flashcard.id === flashcardId ? data.flashcard : flashcard
        )
      );
      cancelEditing();
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to update that flashcard."));
    }
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    setFormError("");

    try {
      await api.delete(`/flashcards/${flashcardId}`);
      setFlashcards((current) =>
        current.filter((flashcard) => flashcard.id !== flashcardId)
      );
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to delete that flashcard."));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[14px] p-6 text-[13.5px] text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        Loading flashcards...
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
    <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-[1fr_340px]">
      <section className="space-y-[18px]">
        <div className="bg-white rounded-[14px] p-3 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          {routeTopicId && (
            <Link
              to={`/app/topics/${routeTopicId}`}
              className="mb-3 inline-flex text-[12.5px] font-semibold text-base-muted hover:text-brand-red"
            >
              Back to topic
            </Link>
          )}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[15px] font-bold text-base-text">
                {routeTopicId ? `${topic?.title} Flashcards` : "Flashcards"}
              </div>
              <div className="text-[12.5px] text-base-muted mt-0.5">
                {flashcards.length} cards ready for review preparation
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-red">
                {ownedCount} yours
              </span>
              {routeTopicId && (
                <span className="rounded-full bg-base-bg px-2.5 py-1 text-[11px] font-semibold text-base-muted">
                  {topic?.subject_area || "BLEPP"}
                </span>
              )}
            </div>
          </div>
        </div>

        {formError && (
          <div className="rounded-[14px] bg-red-50 px-4 py-3 text-[12.5px] font-medium text-red-700">
            {formError}
          </div>
        )}

        {flashcards.length === 0 ? (
          <div className="bg-white rounded-[14px] p-6 text-[13.5px] text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            No flashcards yet. Create the first card from the panel and it will
            stay available after refresh.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {flashcards.map((flashcard) => {
              const canEdit = flashcard.user_id === user?.id;
              const isEditing = editingId === flashcard.id;

              return (
                <article
                  key={flashcard.id}
                  className="bg-white rounded-[14px] p-3 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                >
                  {isEditing ? (
                    <form
                      className="flex flex-col gap-3"
                      onSubmit={(event) =>
                        handleUpdateFlashcard(event, flashcard.id)
                      }
                    >
                      <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
                        Question
                        <textarea
                          name="question"
                          value={editForm.question}
                          onChange={handleEditFormChange}
                          rows={3}
                          className="resize-none rounded-[8px] border-[1.5px] border-base-border px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
                        />
                      </label>
                      <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
                        Answer
                        <textarea
                          name="answer"
                          value={editForm.answer}
                          onChange={handleEditFormChange}
                          rows={4}
                          className="resize-none rounded-[8px] border-[1.5px] border-base-border px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
                        />
                      </label>
                      <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
                        Difficulty
                        <select
                          name="difficulty"
                          value={editForm.difficulty}
                          onChange={handleEditFormChange}
                          className="rounded-[8px] border-[1.5px] border-base-border bg-white px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
                        >
                          {Object.entries(difficultyLabels).map(
                            ([value, label]) => (
                              <option key={value} value={value}>
                                {value} - {label}
                              </option>
                            )
                          )}
                        </select>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="submit"
                          className="rounded-full bg-brand-red px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-brand-dark"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="rounded-full bg-base-bg px-4 py-2 text-[12.5px] font-semibold text-base-muted transition-colors hover:bg-[#eaecef]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="rounded-full bg-brand-soft px-2 py-[3px] text-[11px] font-semibold text-brand-red">
                            Difficulty {flashcard.difficulty || 1}
                          </span>
                          {!routeTopicId && (
                            <div className="mt-2 truncate text-[12px] font-semibold uppercase tracking-wider text-base-muted">
                              {flashcard.topics?.title || "Topic"}
                            </div>
                          )}
                        </div>
                        {!canEdit && (
                          <span className="shrink-0 rounded-full bg-base-bg px-2 py-[3px] text-[11px] font-semibold text-base-muted">
                            Shared
                          </span>
                        )}
                      </div>
                      <h2 className="text-[14px] font-bold leading-5 text-base-text">
                        {flashcard.question}
                      </h2>
                      <p className="mt-3 whitespace-pre-line text-[13px] leading-5 text-base-muted">
                        {flashcard.answer}
                      </p>
                      {canEdit && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => startEditing(flashcard)}
                            className="rounded-full bg-base-bg px-3 py-1.5 text-[12px] font-semibold text-base-muted transition-colors hover:bg-brand-soft hover:text-brand-red"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFlashcard(flashcard.id)}
                            className="rounded-full bg-base-bg px-3 py-1.5 text-[12px] font-semibold text-base-muted transition-colors hover:bg-brand-soft hover:text-brand-red"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <aside className="bg-white rounded-[14px] p-3 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] self-start">
        <div className="mb-[18px] flex items-start justify-between gap-3">
          <div>
            <div className="text-[15px] font-bold text-base-text">
              Add Flashcard
            </div>
            <div className="text-[12.5px] text-base-muted mt-0.5">
              {selectedTopicTitle
                ? `Saving to ${selectedTopicTitle}`
                : "Choose a topic and write both sides"}
            </div>
          </div>
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-red-100">
            <img src={FlashcardsIconUrl} width="18" height="18" alt="" />
          </div>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleCreateFlashcard}>
          {!routeTopicId && (
            <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
              Topic
              <select
                name="topic_id"
                value={form.topic_id}
                onChange={handleFormChange}
                className="rounded-[8px] border-[1.5px] border-base-border bg-white px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
              >
                {topics.length === 0 && <option value="">No topics</option>}
                {topics.map((topicItem) => (
                  <option key={topicItem.id} value={topicItem.id}>
                    {topicItem.title}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
            Question
            <textarea
              name="question"
              value={form.question}
              onChange={handleFormChange}
              rows={4}
              className="resize-none rounded-[8px] border-[1.5px] border-base-border px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
              placeholder="What is the central idea?"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
            Answer
            <textarea
              name="answer"
              value={form.answer}
              onChange={handleFormChange}
              rows={6}
              className="resize-none rounded-[8px] border-[1.5px] border-base-border px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
              placeholder="Write the answer students should recall..."
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
            Difficulty
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleFormChange}
              className="rounded-[8px] border-[1.5px] border-base-border bg-white px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
            >
              {Object.entries(difficultyLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {value} - {label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-full bg-brand-red px-[20px] py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Flashcard"}
          </button>
        </form>
      </aside>
    </div>
  );
};

export default FlashcardsPage;
