import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/api";
import useAuthStore from "../store/authStore";

// SVGs
import FlashcardsIconUrl from "../assets/Flashcards.svg";
import ProgressIconUrl from "../assets/Progress.svg";
import TopicsIconUrl from "../assets/Topics.svg";
import MockIconUrl from "../assets/Mock.svg";
import UploadIconUrl from "../assets/Upload.svg";
import BrainIconUrl from "../assets/Brain.svg";
import ChartIconUrl from "../assets/Chart.svg";
import BagIconUrl from "../assets/Bag.svg";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [reviewStats, setReviewStats] = useState(null);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadReviewStats = async () => {
      try {
        const { data } = await api.get("/srs-reviews/stats");
        if (isMounted) {
          setReviewStats(data.stats);
          setStatsError("");
        }
      } catch (error) {
        if (isMounted) {
          setStatsError(
            error?.response?.data?.message || "Unable to load review stats."
          );
        }
      }
    };

    loadReviewStats();

    return () => {
      isMounted = false;
    };
  }, []);

  const dueCount = reviewStats?.due_count ?? 0;
  const dueTopics = reviewStats?.due_by_topic || [];
  const dueTopicIcons = [BrainIconUrl, ChartIconUrl, BagIconUrl];

  return (
    <>
      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        {/* Card 1 */}
        <Link
          to="/app/flashcards"
          className="bg-white rounded-[14px] p-3 sm:p-6 flex flex-col gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-red-100 flex items-center justify-center">
              <img src={FlashcardsIconUrl} width="18" height="18" alt="" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-[3px] rounded-full bg-green-100 text-green-900 flex items-center gap-0.5">
              ↑ +8
            </span>
          </div>
          <div className="text-[28px] font-bold -tracking-0.5 text-base-text">
            247{" "}
            <span className="text-[14px] font-medium text-brand-red">
              cards
            </span>
          </div>
          <div className="text-[12px] font-semibold text-base-muted uppercase tracking-wider truncate">
            Total Flashcards
          </div>
        </Link>

        {/* Card 2 */}
        <Link
          to="/app/mock"
          className="bg-white rounded-[14px] p-3 sm:p-6 flex flex-col gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-green-100 flex items-center justify-center">
              <img src={ProgressIconUrl} width="18" height="18" alt="" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-[3px] rounded-full bg-green-100 text-green-900 flex items-center gap-0.5">
              ↑ 12%
            </span>
          </div>
          <div className="text-[28px] font-bold -tracking-0.5 text-base-text">
            83 <span className="text-[14px] font-medium text-brand-red">%</span>
          </div>
          <div className="text-[12px] font-semibold text-base-muted uppercase tracking-wider truncate">
            Avg Quiz Score
          </div>
        </Link>

        {/* Card 3 */}
        <Link
          to="/app/mock"
          className="bg-white rounded-[14px] p-3 sm:p-6 flex flex-col gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-blue-100 flex items-center justify-center">
              <img src={TopicsIconUrl} width="18" height="18" alt="" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-[3px] rounded-full bg-gray-100 text-gray-700 flex items-center gap-0.5">
              — same
            </span>
          </div>
          <div className="text-[28px] font-bold -tracking-0.5 text-base-text">
            {dueCount}{" "}
            <span className="text-[14px] font-medium text-brand-red">due</span>
          </div>
          <div className="text-[12px] font-semibold text-base-muted uppercase tracking-wider truncate">
            Cards Due Today
          </div>
        </Link>

        {/* Card 4 */}
        <div className="bg-white rounded-[14px] p-3 sm:p-6 flex flex-col gap-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-[38px] h-[38px] rounded-[10px] bg-amber-100 flex items-center justify-center">
              <img src={MockIconUrl} width="18" height="18" alt="" />
            </div>
            <span className="text-[11px] font-semibold px-2 py-[3px] rounded-full bg-green-100 text-green-900 flex items-center gap-0.5">
              ↑ 2h
            </span>
          </div>
          <div className="text-[28px] font-bold -tracking-0.5 text-base-text">
            18{" "}
            <span className="text-[14px] font-medium text-brand-red">hrs</span>
          </div>
          <div className="text-[12px] font-semibold text-base-muted uppercase tracking-wider truncate">
            Study Time
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4.5">
        {/* LEFT COLUMN */}
        <div>
          {/* TOPIC OVERVIEW */}
          <div className="bg-white rounded-[14px] p-3 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] mb-[18px]">
            <div className="flex items-center justify-between mb-[18px]">
              <div>
                <div className="text-[15px] font-bold text-base-text">
                  Topic Overview
                </div>
                <div className="text-[12.5px] text-base-muted mt-0.5">
                  Your mastery across all BLEPP subjects
                </div>
              </div>
              <Link
                to="/app/topics"
                className="flex items-center gap-1 text-[12.5px] font-medium text-base-muted cursor-pointer px-2.5 py-1 rounded-full bg-base-bg border-none hover:bg-gray-200 transition-colors"
              >
                View Library
              </Link>
            </div>
            <div className="flex flex-col gap-[10px]">
              {/* Topic Row 1 */}
              <Link to="/app/topics" className="flex items-center gap-3 px-3.5 py-3 rounded-[10px] bg-base-bg hover:bg-[#eaecef] transition-colors cursor-pointer">
                <div className="w-[10px] h-[10px] rounded-full bg-brand-red flex-shrink-0" />
                <span className="text-[13.5px] font-medium flex-1 truncate">
                  Psychological Assessment
                </span>
                <div className="w-20 h-[5px] bg-base-border rounded-[3px] overflow-hidden flex-shrink-0 hidden sm:inline">
                  <div className="w-[78%] h-full bg-brand-red rounded-[3px]" />
                </div>
                <span className="text-[12px] font-semibold text-base-muted w-[30px] text-right inline-block">
                  78%
                </span>
              </Link>
              {/* Topic Row 2 */}
              <Link to="/app/topics" className="flex items-center gap-3 px-3.5 py-3 rounded-[10px] bg-base-bg hover:bg-[#eaecef] transition-colors cursor-pointer">
                <div className="w-[10px] h-[10px] rounded-full bg-base-green flex-shrink-0" />
                <span className="text-[13.5px] font-medium flex-1 truncate">
                  Abnormal Psychology
                </span>
                <div className="w-20 h-[5px] bg-base-border rounded-[3px] overflow-hidden flex-shrink-0 hidden sm:inline">
                  <div className="w-[91%] h-full bg-base-green rounded-[3px]" />
                </div>
                <span className="text-[12px] font-semibold text-base-muted w-[30px] text-right inline-block">
                  91%
                </span>
              </Link>
              {/* Topic Row 3 */}
              <Link to="/app/topics" className="flex items-center gap-3 px-3.5 py-3 rounded-[10px] bg-base-bg hover:bg-[#eaecef] transition-colors cursor-pointer">
                <div className="w-[10px] h-[10px] rounded-full bg-base-blue flex-shrink-0" />
                <span className="text-[13.5px] font-medium flex-1 truncate">
                  Industrial / Org. Psychology
                </span>
                <div className="w-20 h-[5px] bg-base-border rounded-[3px] overflow-hidden flex-shrink-0 hidden sm:inline">
                  <div className="w-[62%] h-full bg-base-blue rounded-[3px]" />
                </div>
                <span className="text-[12px] font-semibold text-base-muted w-[30px] text-right inline-block">
                  62%
                </span>
              </Link>
              {/* Topic Row 4 */}
              <Link to="/app/topics" className="flex items-center gap-3 px-3.5 py-3 rounded-[10px] bg-base-bg hover:bg-[#eaecef] transition-colors cursor-pointer">
                <div className="w-[10px] h-[10px] rounded-full bg-base-orange flex-shrink-0" />
                <span className="text-[13.5px] font-medium flex-1 truncate">
                  Research Methods & Stats
                </span>
                <div className="w-20 h-[5px] bg-base-border rounded-[3px] overflow-hidden flex-shrink-0 hidden sm:inline">
                  <div className="w-[55%] h-full bg-base-orange rounded-[3px]" />
                </div>
                <span className="text-[12px] font-semibold text-base-muted w-[30px] text-right inline-block">
                  55%
                </span>
              </Link>
              {/* Topic Row 5 */}
              <Link to="/app/topics" className="flex items-center gap-3 px-3.5 py-3 rounded-[10px] bg-base-bg hover:bg-[#eaecef] transition-colors cursor-pointer">
                <div className="w-[10px] h-[10px] rounded-full bg-purple-500 flex-shrink-0" />
                <span className="text-[13.5px] font-medium flex-1 truncate">
                  Theories of Personality
                </span>
                <div className="w-20 h-[5px] bg-base-border rounded-[3px] overflow-hidden flex-shrink-0 hidden sm:inline">
                  <div className="w-[84%] h-full bg-purple-500 rounded-[3px]" />
                </div>
                <span className="text-[12px] font-semibold text-base-muted w-[30px] text-right inline-block">
                  84%
                </span>
              </Link>
              {/* Topic Row 6 */}
              <Link to="/app/topics" className="flex items-center gap-3 px-3.5 py-3 rounded-[10px] bg-base-bg hover:bg-[#eaecef] transition-colors cursor-pointer">
                <div className="w-[10px] h-[10px] rounded-full bg-pink-500 flex-shrink-0" />
                <span className="text-[13.5px] font-medium flex-1 truncate">
                  Developmental Psychology
                </span>
                <div className="w-20 h-[5px] bg-base-border rounded-[3px] overflow-hidden flex-shrink-0 hidden sm:inline">
                  <div className="w-[70%] h-full bg-pink-500 rounded-[3px]" />
                </div>
                <span className="text-[12px] font-semibold text-base-muted w-[30px] text-right inline-block">
                  70%
                </span>
              </Link>
            </div>
          </div>

          {/* UPLOAD MATERIAL */}
          <div className="bg-white rounded-[14px] p-3 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-[18px]">
              <div>
                <div className="text-[15px] font-bold text-base-text">
                  Upload Review Material
                </div>
                <div className="text-[12.5px] text-base-muted mt-0.5">
                  AI generates flashcards automatically
                </div>
              </div>
            </div>

            <Link
              to="/app/topics"
              className="block border-2 border-dashed border-base-border rounded-[10px] p-3 sm:p-6 text-center cursor-pointer transition-all hover:border-brand-red hover:bg-[#fff5f5] mb-[14px]"
            >
              <div className="text-[28px] mb-2 flex justify-center">
                <img src={UploadIconUrl} width="28" height="28" alt="" />
              </div>
              <div className="text-[13.5px] font-medium text-base-text">
                Open a topic to add review material
              </div>
              <div className="text-[12px] text-base-muted mt-[3px]">
                Notes and source links are available now
              </div>
            </Link>

            <div className="relative mb-3">
              <select
                defaultValue=""
                className="w-full px-3.5 py-2.5 border-[1.5px] border-base-border rounded-[8px] text-[13.5px] text-base-muted bg-white appearance-none cursor-pointer outline-none focus:border-brand-red"
              >
                <option value="" disabled>
                  Select topic category
                </option>
                <option>Psychological Assessment & Testing</option>
                <option>Abnormal Psychology & Psychopathology</option>
                <option>Industrial & Organizational Psychology</option>
                <option>Research Methods & Statistics</option>
                <option>Theories of Personality</option>
                <option>Developmental Psychology</option>
                <option>Social Psychology</option>
                <option>Counseling & Psychotherapy</option>
                <option>Biological Bases of Behavior</option>
              </select>
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-muted pointer-events-none text-[12px]">
                ▾
              </span>
            </div>

            <Link
              to="/app/topics"
              className="inline-flex items-center gap-[6px] bg-brand-red text-white rounded-full px-[20px] py-[9px] text-[13.5px] font-semibold cursor-pointer hover:bg-brand-dark transition-all float-right"
            >
              Add Material
            </Link>
            <div style={{ clear: "both" }} />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* PROFILE CARD */}
          <div className="bg-white rounded-[14px] p-3 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] text-center mb-[18px]">
            <div className="w-[56px] h-[56px] rounded-full bg-brand-soft mx-auto mb-2.5 flex items-center justify-center text-[22px] font-bold text-brand-red border-[3px] border-white shadow-[0_0_0_2px_#E8252A]">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-[15px] font-bold text-base-text">
              {user?.full_name || "User"}
            </div>
            <div className="text-[12px] text-base-muted mt-0.5 mb-3">
              {user?.email || "user@example.com"}
            </div>
            <button className="flex items-center justify-center gap-1.5 bg-brand-red text-white rounded-[20px] py-2 px-[18px] w-full mb-[14px] text-[13px] font-semibold cursor-pointer hover:bg-brand-dark transition-colors">
              View Profile
            </button>
            <div className="grid grid-cols-2 gap-2.5 border-t border-base-border pt-[14px]">
              <div className="text-center">
                <div className="text-[18px] font-bold text-base-text">247</div>
                <div className="text-[11px] text-base-muted mt-0.25">
                  Flashcards
                </div>
              </div>
              <div className="text-center">
                <div className="text-[18px] font-bold text-base-text">12</div>
                <div className="text-[11px] text-base-muted mt-0.25">
                  Quizzes Done
                </div>
              </div>
            </div>
          </div>

          {/* STREAK */}
          <div className="bg-brand-red rounded-[14px] p-3 sm:p-6 mb-[18px] text-white shadow-[0_2px_8px_rgba(232,37,42,0.25)]">
            <div className="flex justify-between items-center mb-[14px]">
              <span className="text-[13px] font-semibold opacity-90">
                Study Streak
              </span>
              <span className="text-[22px]">
                <img
                  src={MockIconUrl}
                  width="18"
                  height="18"
                  style={{ filter: "invert(1)" }}
                  alt=""
                />
              </span>
            </div>
            <div className="text-[42px] font-bold leading-none font-serif">
              7
            </div>
            <div className="text-[12px] opacity-80 mt-[3px]">Days in a row</div>
            <div className="flex gap-1.5 mt-[14px]">
              {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                <div
                  key={day}
                  className="flex-1 flex flex-col items-center gap-1 text-[10px] opacity-80 uppercase tracking-[0.3px]"
                >
                  <div className="w-[22px] h-[22px] rounded-full bg-white/20" />
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* DUE TODAY */}
          <div className="bg-white rounded-[14px] p-3 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[15px] font-bold text-base-text">
                Due Today
              </div>
              <Link
                to="/app/review"
                className="inline-flex items-center gap-[6px] bg-brand-red text-white rounded-[20px] px-[14px] py-[6px] text-[12px] font-semibold cursor-pointer hover:bg-brand-dark transition-colors"
              >
                Review All
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {statsError ? (
                <div className="rounded-[8px] bg-red-50 px-3 py-[9px] text-[12.5px] font-medium text-red-700">
                  {statsError}
                </div>
              ) : dueTopics.length === 0 ? (
                <div className="rounded-[8px] bg-base-bg px-3 py-[12px] text-[13px] text-base-muted">
                  No cards due right now.
                </div>
              ) : (
                dueTopics.slice(0, 4).map((item, idx) => (
                  <Link
                    key={item.topic_id}
                    to="/app/review"
                    className="flex items-center justify-center gap-2.5 px-3 py-[9px] bg-base-bg rounded-[8px] text-[13px] hover:bg-[#eaecef] transition-colors"
                  >
                    <img
                      src={dueTopicIcons[idx % dueTopicIcons.length]}
                      width="18"
                      height="18"
                      alt=""
                    />
                    <span className="truncate">{item.title}</span>
                    <span className="bg-brand-red text-white text-[11px] font-bold rounded-[10px] px-[7px] py-[2px] ml-auto flex-shrink-0">
                      {item.count}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
