import { Link } from "react-router";
import { useAuth } from "../../lib/auth";
import { Package, Scan, CheckCircle2, AlertTriangle, RefreshCw, TrendingUp } from "lucide-react";

const DEMO_PRODUCTS = [
  { id: "p1", name: "XYZ Premium Rice 5kg", sku: "XYZ-RICE-5K", lastScan: "2026-09-05", status: "requires_verification" as const, checks: 5, fulfilled: 4 },
  { id: "p2", name: "XYZ Basmati Rice 1kg", sku: "XYZ-BASM-1K", lastScan: "2026-09-03", status: "compliant" as const, checks: 5, fulfilled: 5 },
  { id: "p3", name: "Demo Cooking Oil 1L", sku: "DCO-OIL-1L", lastScan: "2026-09-01", status: "potential_non_compliant" as const, checks: 5, fulfilled: 3 },
];

const STATUS_CONFIG = {
  compliant: { label: "Compliant", cls: "bg-green-50 text-green-700 border-green-200", icon: <CheckCircle2 size={12} /> },
  requires_verification: { label: "Requires Verification", cls: "bg-amber-50 text-amber-700 border-amber-200", icon: <AlertTriangle size={12} /> },
  potential_non_compliant: { label: "Potential Non-Compliant", cls: "bg-red-50 text-red-700 border-red-200", icon: <AlertTriangle size={12} /> },
};

export default function PreventDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-emerald-900">Manufacturer Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{user?.organization} — Check packaging before it reaches the market.</p>
        </div>
        <Link
          to="/prevent/scan"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white text-sm font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <Scan size={16} />
          Scan New Label
        </Link>
      </div>

      <div className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2">
        ⚠️ DEMO DATA — Product records shown are illustrative. Actual scans you perform are real.
      </div>

      {/* Workflow */}
      <div className="bg-emerald-700 text-white rounded-xl p-5">
        <div className="text-xs font-mono opacity-60 mb-2">PREVENT WORKFLOW</div>
        <div className="flex flex-wrap gap-2 items-center">
          {["UPLOAD", "ANALYZE", "FIX", "RE-SCAN", "COMPLIANCE READY"].map((s, i, arr) => (
            <div key={s} className="flex items-center gap-2">
              <span className="text-sm font-semibold">{s}</span>
              {i < arr.length - 1 && <span className="text-emerald-300 text-xs">→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Products / SKUs" value="3" icon={<Package size={16} />} color="text-emerald-700" bg="bg-emerald-50" note="DEMO DATA" />
        <StatCard label="Compliant" value="1" icon={<CheckCircle2 size={16} />} color="text-green-600" bg="bg-green-50" note="DEMO DATA" />
        <StatCard label="Needs Attention" value="2" icon={<AlertTriangle size={16} />} color="text-amber-600" bg="bg-amber-50" note="DEMO DATA" />
        <StatCard label="Total Checks" value="15" icon={<TrendingUp size={16} />} color="text-gray-600" bg="bg-gray-100" note="DEMO DATA" />
      </div>

      {/* Products */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-700">Product / SKU Compliance History</h2>
          <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">DEMO DATA</span>
        </div>
        <div className="divide-y divide-gray-50">
          {DEMO_PRODUCTS.map((p) => {
            const sc = STATUS_CONFIG[p.status];
            return (
              <div key={p.id} className="px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium text-gray-800 text-sm">{p.name}</div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">SKU: {p.sku} · Last scan: {p.lastScan}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">{p.fulfilled}/{p.checks}</span> checks verified
                  </div>
                  <span className={`inline-flex items-center gap-1 border rounded-full text-xs font-medium px-2.5 py-0.5 ${sc.cls}`}>
                    {sc.icon}
                    {sc.label}
                  </span>
                  <Link to="/prevent/scan" className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
                    <RefreshCw size={11} />
                    Re-scan
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <strong>AI screening result — not a legal certification.</strong> Results are based on OCR extraction and deterministic rule evaluation against the Legal Metrology Act, 2009. Consult qualified legal counsel for final compliance determination.
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, bg, note }: { label: string; value: string; icon: React.ReactNode; color: string; bg: string; note?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center mb-3`}>{icon}</div>
      <div className={`text-2xl font-bold ${color} mb-0.5`}>{value}</div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      {note && <div className="text-[10px] font-mono text-gray-400 mt-0.5">{note}</div>}
    </div>
  );
}
