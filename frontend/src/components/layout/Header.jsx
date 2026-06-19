import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

// SVGs mapped to components for simple usage
import logoSolidUrl from "../../assets/logo_solid.svg";
import DashboardIconUrl from "../../assets/Dashboard.svg";
import TopicsIconUrl from "../../assets/Topics.svg";
import FlashcardsIconUrl from "../../assets/Flashcards.svg";
import BrainIconUrl from "../../assets/Brain.svg";
import MockIconUrl from "../../assets/Mock.svg";
import ProgressIconUrl from "../../assets/Progress.svg";
import UploadIconUrl from "../../assets/Upload.svg";
import { useState } from "react";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  const navLinks = [
    { to: "/app", label: "Dashboard", icon: DashboardIconUrl },
    { to: "/app/topics", label: "Topics", icon: TopicsIconUrl },
    { to: "/app/flashcards", label: "Flashcards", icon: FlashcardsIconUrl },
    { to: "/app/review", label: "Review", icon: BrainIconUrl },
    { to: "/app/mock", label: "Mock Exam", icon: MockIconUrl },
    { to: "/app/progress", label: "Progress", icon: ProgressIconUrl },
    { to: "/app/upload", label: "Upload", icon: UploadIconUrl },
  ];

  const isActiveLink = (to) =>
    to === "/app"
      ? location.pathname === to
      : location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <>
      <header className="sticky top-0 z-50 flex items-stretch justify-between gap-3 bg-brand-red px-[18px] py-[10px] sm:px-[28px] sm:py-[14px]">
        {/* LEFT COMPONENT */}
        <div className="flex flex-row items-center gap-[10px] lg:flex-col lg:items-start lg:justify-evenly lg:gap-2">
          {/* Logo */}
          <Link to="/app" className="flex shrink-0 items-center gap-[5px]">
            <img
              src={logoSolidUrl}
              alt="Psyckie"
              className="h-8 w-8"
              style={{ objectFit: "contain" }}
            />
            <span className="text-[17px] font-bold tracking-[-0.3px] text-white">
              Psyckie
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-[2px]">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center gap-[6px] whitespace-nowrap rounded-[6px] px-[10px] py-[5px] text-[13px] font-medium transition-colors ${
                      isActiveLink(link.to)
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <img
                      src={link.icon}
                      alt={link.label}
                      className={`h-[14px] w-[14px] shrink-0 transition-opacity ${
                        isActiveLink(link.to)
                          ? "opacity-100"
                          : "opacity-80"
                      }`}
                      style={{ filter: "invert(1)" }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* RIGHT COMPONENT */}
        <div className="flex shrink-0 flex-row items-center gap-2 lg:flex-col lg:items-end lg:justify-evenly lg:gap-[8px]">
          {/* User Pill */}
          <div
            onClick={logout}
            className="flex cursor-pointer items-center gap-2 rounded-[20px] bg-white/15 py-[5px] pl-[5px] pr-[12px] hover:bg-white/20 transition-colors"
            title="Logout"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[12px] font-bold text-brand-red">
              {getInitial(user?.full_name || user?.email)}
            </div>
            <span className="text-[13px] font-medium text-white">
              {user?.full_name || "User"}
            </span>
          </div>

          {/* Consult Button / Mobile Toggle */}
          <Link
            to="/app/review"
            className="hidden items-center gap-[6px] whitespace-nowrap rounded-[20px] bg-white px-[18px] py-[7px] text-[13px] font-semibold text-brand-red transition-opacity hover:opacity-90 lg:flex"
          >
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Start Review
          </Link>

          {/* Hamburger (Mobile) */}
          <button
            className="flex flex-col gap-[5px] bg-transparent p-1 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span
              className={`block h-[2px] w-[22px] rounded-[2px] bg-white transition-transform ${
                mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-[22px] rounded-[2px] bg-white transition-opacity ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-[22px] rounded-[2px] bg-white transition-transform ${
                mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <nav className="fixed left-0 right-0 z-40 flex flex-col gap-[2px] border-t border-white/15 bg-brand-red p-[12px_18px_18px] lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 rounded-lg px-3 py-[10px] text-[14px] font-medium transition-colors ${
                isActiveLink(link.to)
                  ? "bg-white/15 text-white"
                  : "text-white/90 hover:bg-white/15 hover:text-white"
              }`}
            >
              <img
                src={link.icon}
                alt={link.label}
                className="h-[14px] w-[14px]"
                style={{ filter: "invert(1)" }}
              />
              {link.label}
            </Link>
          ))}
          <Link
            to="/app/review"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 flex items-center justify-center gap-[6px] whitespace-nowrap rounded-[20px] bg-white px-[18px] py-[10px] text-[14px] font-semibold text-brand-red transition-opacity hover:opacity-90"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Start Review
          </Link>
        </nav>
      )}
    </>
  );
};

export default Header;
