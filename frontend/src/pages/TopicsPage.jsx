import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import TopicsIconUrl from "../assets/Topics.svg";

const topicColors = [
  "bg-brand-red",
  "bg-base-green",
  "bg-base-blue",
  "bg-base-orange",
  "bg-purple-500",
  "bg-pink-500",
];

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const TopicsPage = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    subject_area: "Custom",
    description: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadTopics = async () => {
      setIsLoading(true);
      setError("");

      try {
        const { data } = await api.get("/topics");
        if (isMounted) {
          setTopics(data.topics || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, "Unable to load topics right now."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTopics();

    return () => {
      isMounted = false;
    };
  }, []);

  const presetTopics = useMemo(
    () => topics.filter((topic) => topic.is_preset),
    [topics]
  );
  const customTopics = useMemo(
    () => topics.filter((topic) => !topic.is_preset),
    [topics]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateTopic = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.title.trim()) {
      setFormError("Add a topic title first.");
      return;
    }

    setIsCreating(true);

    try {
      const { data } = await api.post("/topics", form);
      setTopics((current) => [...current, data.topic]);
      setForm({ title: "", subject_area: "Custom", description: "" });
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to create that topic."));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTopic = async (topicId) => {
    setFormError("");

    try {
      await api.delete(`/topics/${topicId}`);
      setTopics((current) => current.filter((topic) => topic.id !== topicId));
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to delete that custom topic."));
    }
  };

  const renderTopicCard = (topic, index) => (
    <div
      key={topic.id}
      className="bg-white rounded-[14px] p-3 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200"
    >
      <Link to={`/app/topics/${topic.id}`} className="block">
        <div className="flex items-start gap-3">
          <div
            className={`mt-1 h-[10px] w-[10px] shrink-0 rounded-full ${
              topicColors[index % topicColors.length]
            }`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[15px] font-bold text-base-text">
                {topic.title}
              </h2>
              <span
                className={`rounded-full px-2 py-[3px] text-[11px] font-semibold ${
                  topic.is_preset
                    ? "bg-brand-soft text-brand-red"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {topic.is_preset ? "Preset" : "Custom"}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-base-muted">
              {topic.description || "No description yet."}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="truncate text-[12px] font-semibold uppercase tracking-wider text-base-muted">
                {topic.subject_area || "BLEPP"}
              </span>
              <span className="text-[12.5px] font-semibold text-brand-red">
                Open
              </span>
            </div>
          </div>
        </div>
      </Link>

      {!topic.is_preset && (
        <button
          type="button"
          onClick={() => handleDeleteTopic(topic.id)}
          className="mt-3 rounded-full bg-base-bg px-3 py-1.5 text-[12px] font-semibold text-base-muted transition-colors hover:bg-brand-soft hover:text-brand-red"
        >
          Delete custom topic
        </button>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-[1fr_330px]">
      <section className="space-y-[18px]">
        <div className="bg-white rounded-[14px] p-3 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[15px] font-bold text-base-text">
                Topic Library
              </div>
              <div className="text-[12.5px] text-base-muted mt-0.5">
                Browse BLEPP categories and your custom study areas
              </div>
            </div>
            <div className="hidden h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-red-100 sm:flex">
              <img src={TopicsIconUrl} width="18" height="18" alt="" />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="bg-white rounded-[14px] p-6 text-[13.5px] text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            Loading topics...
          </div>
        )}

        {error && (
          <div className="rounded-[14px] border border-red-200 bg-red-50 p-4 text-[13.5px] font-medium text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && topics.length === 0 && (
          <div className="bg-white rounded-[14px] p-6 text-[13.5px] text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            No topics are available yet.
          </div>
        )}

        {!isLoading && !error && presetTopics.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h1 className="text-[14px] font-bold text-base-text">
                BLEPP Presets
              </h1>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                {presetTopics.length} topics
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {presetTopics.map(renderTopicCard)}
            </div>
          </div>
        )}

        {!isLoading && !error && customTopics.length > 0 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h1 className="text-[14px] font-bold text-base-text">
                Custom Topics
              </h1>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                {customTopics.length} topics
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {customTopics.map((topic, index) =>
                renderTopicCard(topic, index + presetTopics.length)
              )}
            </div>
          </div>
        )}
      </section>

      <aside className="bg-white rounded-[14px] p-3 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] self-start">
        <div className="mb-[18px]">
          <div className="text-[15px] font-bold text-base-text">
            Add Custom Topic
          </div>
          <div className="text-[12.5px] text-base-muted mt-0.5">
            Create a personal area for notes and materials
          </div>
        </div>

        {formError && (
          <div className="mb-3 rounded-[10px] bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">
            {formError}
          </div>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleCreateTopic}>
          <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="rounded-[8px] border-[1.5px] border-base-border px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
              placeholder="Clinical case drills"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
            Subject Area
            <input
              name="subject_area"
              value={form.subject_area}
              onChange={handleChange}
              className="rounded-[8px] border-[1.5px] border-base-border px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
              placeholder="Custom"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="resize-none rounded-[8px] border-[1.5px] border-base-border px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
              placeholder="What should this topic collect?"
            />
          </label>

          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center justify-center rounded-full bg-brand-red px-[20px] py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? "Creating..." : "Create Topic"}
          </button>
        </form>
      </aside>
    </div>
  );
};

export default TopicsPage;
