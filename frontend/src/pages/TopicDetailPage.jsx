import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/api";
import useAuthStore from "../store/authStore";
import UploadIconUrl from "../assets/Upload.svg";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const TopicDetailPage = () => {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const [topic, setTopic] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    source_url: "",
    content: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadTopic = async () => {
      setIsLoading(true);
      setError("");

      try {
        const [topicResponse, materialsResponse] = await Promise.all([
          api.get(`/topics/${id}`),
          api.get("/materials", { params: { topic_id: id } }),
        ]);

        if (isMounted) {
          setTopic(topicResponse.data.topic);
          setMaterials(materialsResponse.data.materials || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(getErrorMessage(err, "Unable to load this topic."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTopic();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const ownedMaterials = useMemo(
    () => materials.filter((material) => material.user_id),
    [materials]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateMaterial = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.title.trim()) {
      setFormError("Add a material title first.");
      return;
    }

    if (!form.content.trim()) {
      setFormError("Add notes or source content before saving.");
      return;
    }

    setIsCreating(true);

    try {
      const { data } = await api.post("/materials", {
        topic_id: id,
        title: form.title,
        source_url: form.source_url,
        content: form.content,
        content_type: "markdown",
      });
      setMaterials((current) => [data.material, ...current]);
      setForm({ title: "", source_url: "", content: "" });
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to save that material."));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    setFormError("");

    try {
      await api.delete(`/materials/${materialId}`);
      setMaterials((current) =>
        current.filter((material) => material.id !== materialId)
      );
    } catch (err) {
      setFormError(getErrorMessage(err, "Unable to delete that material."));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[14px] p-6 text-[13.5px] text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        Loading topic materials...
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

  if (!topic) {
    return (
      <div className="bg-white rounded-[14px] p-6 text-[13.5px] text-base-muted shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        Topic not found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-[1fr_340px]">
      <section className="space-y-[18px]">
        <div className="bg-white rounded-[14px] p-3 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <Link
            to="/app/topics"
            className="mb-3 inline-flex text-[12.5px] font-semibold text-base-muted hover:text-brand-red"
          >
            Back to topics
          </Link>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[20px] font-bold text-base-text">
                  {topic.title}
                </h1>
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
              <p className="mt-1 max-w-2xl text-[13.5px] leading-6 text-base-muted">
                {topic.description || "No description has been added yet."}
              </p>
            </div>
            <span className="rounded-full bg-base-bg px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-base-muted">
              {topic.subject_area || "BLEPP"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-[14px] p-3 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="mb-[18px] flex items-center justify-between gap-3">
            <div>
              <div className="text-[15px] font-bold text-base-text">
                Materials
              </div>
              <div className="text-[12.5px] text-base-muted mt-0.5">
                {materials.length} saved for this topic
              </div>
            </div>
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-red">
              {ownedMaterials.length} yours
            </span>
          </div>

          {materials.length === 0 ? (
            <div className="rounded-[10px] bg-base-bg px-3.5 py-4 text-[13.5px] text-base-muted">
              No materials yet. Add notes or a source summary from the panel.
            </div>
          ) : (
            <div className="flex flex-col gap-[10px]">
              {materials.map((material) => {
                const canDelete = material.user_id === user?.id;

                return (
                  <article
                    key={material.id}
                    className="rounded-[10px] bg-base-bg px-3.5 py-3 transition-colors hover:bg-[#eaecef]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-[13.5px] font-bold text-base-text">
                            {material.title}
                          </h2>
                          <span className="rounded-full bg-white px-2 py-[3px] text-[11px] font-semibold text-base-muted">
                            {material.content_type || "markdown"}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-base-muted">
                          {material.content}
                        </p>
                        {material.source_url && (
                          <a
                            href={material.source_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex max-w-full truncate text-[12px] font-semibold text-brand-red"
                          >
                            {material.source_url}
                          </a>
                        )}
                      </div>
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteMaterial(material.id)}
                          className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-base-muted transition-colors hover:bg-brand-soft hover:text-brand-red"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <aside className="bg-white rounded-[14px] p-3 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] self-start">
        <div className="mb-[18px] flex items-start justify-between gap-3">
          <div>
            <div className="text-[15px] font-bold text-base-text">
              Add Material
            </div>
            <div className="text-[12.5px] text-base-muted mt-0.5">
              Save notes, excerpts, or a source link
            </div>
          </div>
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-red-100">
            <img src={UploadIconUrl} width="18" height="18" alt="" />
          </div>
        </div>

        <div className="mb-3 rounded-[10px] border-2 border-dashed border-base-border p-3 text-center text-[12.5px] text-base-muted">
          File upload and OCR will plug in here after storage metadata is added.
        </div>

        {formError && (
          <div className="mb-3 rounded-[10px] bg-red-50 px-3 py-2 text-[12.5px] font-medium text-red-700">
            {formError}
          </div>
        )}

        <form className="flex flex-col gap-3" onSubmit={handleCreateMaterial}>
          <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="rounded-[8px] border-[1.5px] border-base-border px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
              placeholder="DSM-5 anxiety notes"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
            Source URL
            <input
              name="source_url"
              value={form.source_url}
              onChange={handleChange}
              className="rounded-[8px] border-[1.5px] border-base-border px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
              placeholder="https://..."
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[12.5px] font-semibold text-base-text">
            Content
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={7}
              className="resize-none rounded-[8px] border-[1.5px] border-base-border px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-brand-red"
              placeholder="Paste notes, excerpts, or a summary..."
            />
          </label>

          <button
            type="submit"
            disabled={isCreating}
            className="inline-flex items-center justify-center rounded-full bg-brand-red px-[20px] py-[9px] text-[13.5px] font-semibold text-white transition-all hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? "Saving..." : "Save Material"}
          </button>
        </form>
      </aside>
    </div>
  );
};

export default TopicDetailPage;
