import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import Header from "./Header";

const ProtectedLayout = () => {
  const token = useAuthStore((state) => state.token);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-base-muted">
        Loading your workspace...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-base-bg text-base-text font-sans">
      <Header />
      {/* RED HEADER SPACER */}
      <div className="bg-brand-red pb-[48px]"></div>

      {/* MAIN CONTENT wrapper */}
      <main className="mx-auto max-w-[1100px] -mt-[36px] px-[12px] pb-[24px] sm:px-[24px] sm:pb-[48px] w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
