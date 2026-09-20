import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ShieldCheck, Scale, Package, ShoppingBag, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth, getRoleBasePath } from "../lib/auth";
import type { Role } from "../lib/store";

const ROLES: Array<{ role: Role; label: string; sub: string; icon: React.ReactNode; color: string; bg: string; email: string; pwd: string }> = [
  {
    role: "inspector",
    label: "Legal Metrology Inspector",
    sub: "ENFORCE",
    icon: <Scale size={22} />,
    color: "border-[#1a2744] text-[#1a2744]",
    bg: "bg-[#1a2744]",
    email: "inspector@labelsure.gov.in",
    pwd: "inspect123",
  },
  {
    role: "manufacturer",
    label: "Manufacturer / Packer / Importer",
    sub: "PREVENT",
    icon: <Package size={22} />,
    color: "border-emerald-700 text-emerald-700",
    bg: "bg-emerald-700",
    email: "manufacturer@labelsure.com",
    pwd: "mfr123",
  },
  {
    role: "consumer",
    label: "Consumer",
    sub: "VERIFY",
    icon: <ShoppingBag size={22} />,
    color: "border-violet-700 text-violet-700",
    bg: "bg-violet-700",
    email: "consumer@labelsure.com",
    pwd: "consumer123",
  },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleConfig = ROLES.find((r) => r.role === selectedRole);

  const fillDemo = () => {
    if (roleConfig) {
      setEmail(roleConfig.email);
      setPassword(roleConfig.pwd);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(email, password);
    if (result.success) {
      const user = { role: selectedRole! };
      navigate(getRoleBasePath(selectedRole!));
    } else {
      setError(result.error || "Login failed.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f0f2f7] flex flex-col">
      <header className="bg-[#1a2744] text-white">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck size={22} className="text-amber-400" />
            <span className="font-serif font-bold text-lg">LabelSure</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={14} />
            Back
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-[#1a2744] mb-1">Welcome to LabelSure</h1>
            <p className="text-sm text-gray-500">Select your role to access your workspace</p>
          </div>

          {!selectedRole ? (
            <div className="space-y-3">
              {ROLES.map((r) => (
                <button
                  key={r.role}
                  onClick={() => setSelectedRole(r.role)}
                  className={`w-full flex items-center gap-4 p-4 bg-white border-2 ${r.color} rounded-xl hover:shadow-md transition-all text-left`}
                >
                  <div className={`w-12 h-12 rounded-lg ${r.bg} text-white flex items-center justify-center shrink-0`}>
                    {r.icon}
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-gray-400 tracking-widest">{r.sub}</div>
                    <div className="font-semibold text-gray-800 text-sm">{r.label}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className={`${roleConfig?.bg} text-white px-5 py-4`}>
                <div className="flex items-center gap-3">
                  {roleConfig?.icon}
                  <div>
                    <div className="text-xs font-mono opacity-70">{roleConfig?.sub}</div>
                    <div className="font-semibold">{roleConfig?.label}</div>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/30 focus:border-[#1a2744]"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2744]/30 focus:border-[#1a2744] pr-9"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#1a2744] text-white font-semibold text-sm rounded-lg hover:bg-[#243258] transition-colors disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <div className="pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-400 mb-2">Demo credentials for this role:</div>
                  <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs font-mono text-gray-600">
                    <div>Email: {roleConfig?.email}</div>
                    <div>Password: {roleConfig?.pwd}</div>
                  </div>
                  <button
                    type="button"
                    onClick={fillDemo}
                    className="mt-2 text-xs text-blue-600 hover:underline"
                  >
                    Fill demo credentials
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { setSelectedRole(null); setError(null); setEmail(""); setPassword(""); }}
                  className="text-xs text-gray-400 hover:text-gray-600 w-full text-center"
                >
                  ← Change role
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
