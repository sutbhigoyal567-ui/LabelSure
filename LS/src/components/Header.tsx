import { Bell, LogOut, Shield, ShieldCheck, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth, getRoleBasePath } from "../lib/auth";
import { getNotifications, markAllRead } from "../lib/store";
import { useState } from "react";

const ROLE_LABELS = {
  inspector: "Legal Metrology Inspector",
  manufacturer: "Manufacturer",
  consumer: "Consumer",
};

const ROLE_COLORS = {
  inspector: "bg-[#1a2744] text-white",
  manufacturer: "bg-emerald-800 text-white",
  consumer: "bg-violet-800 text-white",
};

const NAV_LINKS: Record<string, Array<{ label: string; path: string }>> = {
  inspector: [
    { label: "Dashboard", path: "/enforce" },
    { label: "Scan", path: "/enforce/scan" },
    { label: "Inspections", path: "/enforce/inspections" },
    { label: "Reports", path: "/enforce/reports" },
    { label: "Knowledge Base", path: "/knowledge-base" },
  ],
  manufacturer: [
    { label: "Dashboard", path: "/prevent" },
    { label: "Scan", path: "/prevent/scan" },
    { label: "Products", path: "/prevent/products" },
    { label: "Knowledge Base", path: "/knowledge-base" },
  ],
  consumer: [
    { label: "Home", path: "/verify" },
    { label: "Scan Product", path: "/verify/scan" },
    { label: "My Complaints", path: "/verify/complaints" },
    { label: "Knowledge Base", path: "/knowledge-base" },
  ],
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);

  if (!user) return null;

  const notifications = getNotifications(user.role);
  const unread = notifications.filter((n) => !n.read).length;
  const navLinks = NAV_LINKS[user.role] || [];
  const basePath = getRoleBasePath(user.role);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleNotif = () => {
    if (!showNotif) markAllRead(user.role);
    setShowNotif(!showNotif);
  };

  return (
    <header className={`${ROLE_COLORS[user.role]} shadow-md sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to={basePath} className="flex items-center gap-2 shrink-0">
          <ShieldCheck size={22} className="text-amber-400" />
          <span className="font-serif font-bold text-lg tracking-tight">LabelSure</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Role badge */}
          <span className="hidden md:block text-xs bg-white/15 px-2.5 py-1 rounded-full font-mono">
            {ROLE_LABELS[user.role]}
          </span>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotif}
              className="relative p-1.5 rounded hover:bg-white/10 transition-colors"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 rounded-full text-[10px] text-black font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>
            {showNotif && (
              <div className="absolute right-0 top-10 w-80 bg-white text-gray-800 shadow-xl rounded-xl border border-gray-200 z-50 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-gray-100 font-semibold text-sm text-gray-700">
                  Notifications
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.slice(0, 8).map((n) => (
                    <div key={n.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
                      <div className="text-sm font-medium text-gray-800">{n.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{n.message}</div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User */}
          <div className="flex items-center gap-1.5">
            <User size={16} className="text-white/70" />
            <span className="text-sm text-white/80 hidden md:block">{user.name}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
            <span className="hidden md:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
