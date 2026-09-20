import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { useAuth } from "./lib/auth";
import type { Role } from "./lib/store";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import KnowledgeBase from "./pages/KnowledgeBase";

// Enforce
import EnforceDashboard from "./pages/enforce/EnforceDashboard";
import EnforceScan from "./pages/enforce/EnforceScan";
import EnforceInspections from "./pages/enforce/EnforceInspections";
import EnforceReports from "./pages/enforce/EnforceReports";

// Prevent
import PreventDashboard from "./pages/prevent/PreventDashboard";
import PreventScan from "./pages/prevent/PreventScan";

// Verify
import VerifyDashboard from "./pages/verify/VerifyDashboard";
import VerifyScan from "./pages/verify/VerifyScan";
import VerifyComplaints from "./pages/verify/VerifyComplaints";

function AuthGuard({ allowedRole }: { allowedRole: Role }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== allowedRole) {
    const redirects: Record<Role, string> = {
      inspector: "/enforce",
      manufacturer: "/prevent",
      consumer: "/verify",
    };
    return <Navigate to={redirects[user!.role]} replace />;
  }
  return <Outlet />;
}

function AppShell() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f2f7]">
      {isAuthenticated && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppShell,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: Login },
      { path: "knowledge-base", Component: KnowledgeBase },

      // ENFORCE — Inspector only
      {
        path: "enforce",
        element: <AuthGuard allowedRole="inspector" />,
        children: [
          { index: true, Component: EnforceDashboard },
          { path: "scan", Component: EnforceScan },
          { path: "inspections", Component: EnforceInspections },
          { path: "inspections/:id", Component: EnforceInspections },
          { path: "reports", Component: EnforceReports },
        ],
      },

      // PREVENT — Manufacturer only
      {
        path: "prevent",
        element: <AuthGuard allowedRole="manufacturer" />,
        children: [
          { index: true, Component: PreventDashboard },
          { path: "scan", Component: PreventScan },
          { path: "products", Component: PreventDashboard },
        ],
      },

      // VERIFY — Consumer only
      {
        path: "verify",
        element: <AuthGuard allowedRole="consumer" />,
        children: [
          { index: true, Component: VerifyDashboard },
          { path: "scan", Component: VerifyScan },
          { path: "complaints", Component: VerifyComplaints },
        ],
      },

      // 404
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
