import { Link } from "react-router";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Scan, FileText, AlertTriangle, CheckCircle2, Clock, TrendingUp, MapPin } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { getInspections } from "../../lib/store";
import { InspectionStatusBadge } from "../../components/StatusBadge";

const WEEKLY_DATA = [
  { day: "Mon", inspections: 4, violations: 1 },
  { day: "Tue", inspections: 6, violations: 2 },
  { day: "Wed", inspections: 3, violations: 0 },
  { day: "Thu", inspections: 8, violations: 3 },
  { day: "Fri", inspections: 5, violations: 1 },
  { day: "Sat", inspections: 2, violations: 0 },
  { day: "Sun", inspections: 1, violations: 0 },
];

const GEO_DATA = [
  { state: "Delhi", risk: 4 },
  { state: "Mumbai", risk: 3 },
  { state: "Bengaluru", risk: 2 },
  { state: "Kolkata", risk: 2 },
  { state: "Chennai", risk: 1 },
  { state: "Pune", risk: 3 },
];

export default function EnforceDashboard() {
  const { user } = useAuth();
  const inspections = getInspections();
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = inspections.filter((i) => i.date === today).length;
  const violations = inspections.filter((i) => i.status === "potential_non_compliant").length;
  const requiresVerif = inspections.filter((i) => i.status === "requires_verification").length;
  const recent = inspections.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1a2744]">Enforcement Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {user?.organization} — {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link
          to="/enforce/scan"
          className="flex items-center gap-2 px-4 py-2 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#243258] transition-colors"
        >
          <Scan size={16} />
          New Inspection
        </Link>
      </div>

      {/* Demo notice */}
      <div className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-3 py-2">
        ⚠️ DEMO DATA — Dashboard statistics shown are illustrative. Only inspection records you create are real.
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Clock size={18} />} label="Inspections Today" value={String(todayCount || "—")} sub="Real records only" color="text-[#1a2744]" bg="bg-[#1a2744]/5" />
        <StatCard icon={<AlertTriangle size={18} />} label="Potential Violations" value={String(violations)} sub="Requires human verification" color="text-red-600" bg="bg-red-50" />
        <StatCard icon={<Clock size={18} />} label="Requires Verification" value={String(requiresVerif)} sub="Pending inspector review" color="text-amber-600" bg="bg-amber-50" />
        <StatCard icon={<TrendingUp size={18} />} label="Total Inspections" value={String(inspections.length)} sub="All recorded" color="text-green-700" bg="bg-green-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Weekly Activity — DEMO VISUALIZATION</h2>
            <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">Illustrative prototype data</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={WEEKLY_DATA} barGap={4}>
              <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="inspections" name="Inspections" radius={[3, 3, 0, 0]}>
                {WEEKLY_DATA.map((_, i) => <Cell key={i} fill="#1a2744" fillOpacity={0.7} />)}
              </Bar>
              <Bar dataKey="violations" name="Pot. Violations" radius={[3, 3, 0, 0]}>
                {WEEKLY_DATA.map((_, i) => <Cell key={i} fill="#dc2626" fillOpacity={0.7} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Geo risk */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">Risk Priority by Region</h2>
          <p className="text-[10px] text-gray-400 font-mono mb-3">DEMO VISUALIZATION — Not official statistics</p>
          <div className="space-y-2">
            {GEO_DATA.map((g) => (
              <div key={g.state} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-sm text-gray-700">
                  <MapPin size={12} className="text-gray-400" />
                  {g.state}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(g.risk / 4) * 100}%`,
                        backgroundColor: g.risk >= 3 ? "#dc2626" : g.risk === 2 ? "#d97706" : "#16a34a",
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono text-gray-500 w-4">{g.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent inspections */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-700">Recent Inspections</h2>
          <Link to="/enforce/inspections" className="text-xs text-blue-600 hover:underline">View all</Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-400">
            <Scan size={32} className="mx-auto mb-2 text-gray-300" />
            No inspections yet. Start by scanning a product label.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Inspection ID</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Product</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hidden md:table-cell">Location</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((ins) => (
                  <tr key={ins.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{ins.inspectionNumber}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{ins.product}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{ins.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{ins.location}</td>
                    <td className="px-4 py-3"><InspectionStatusBadge status={ins.status} /></td>
                    <td className="px-4 py-3">
                      <Link to={`/enforce/inspections/${ins.id}`} className="text-xs text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, sub, color, bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className={`w-9 h-9 rounded-lg ${bg} ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className={`text-2xl font-bold ${color} mb-0.5`}>{value}</div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
    </div>
  );
}
