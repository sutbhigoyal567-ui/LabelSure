import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, BookOpen, ArrowLeft, Shield } from "lucide-react";
import { LEGAL_SECTIONS, searchSections } from "../lib/legal";
import type { LegalSection } from "../lib/legal";
import { useAuth } from "../lib/auth";

const TOPICS = [
  "Pre-packaged commodities",
  "Standard units",
  "Inspection",
  "Declarations",
  "Penalties",
  "Appeals",
  "Weights and measures",
  "Import",
  "Manufacture",
  "General",
];

const BADGE_CONFIG = {
  ACT_SOURCE: { label: "ACT SOURCE", cls: "bg-[#1a2744]/10 text-[#1a2744] border-[#1a2744]/20" },
  RULE_DEPENDENT: { label: "RULE-DEPENDENT", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  DIRECT_VALIDATION: { label: "DIRECT VALIDATION", cls: "bg-green-50 text-green-700 border-green-200" },
};

export default function KnowledgeBase() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [selected, setSelected] = useState<LegalSection | null>(null);

  const results = query || topic
    ? searchSections(query || topic).filter((s) => !topic || s.topics.some((t) => t.toLowerCase().includes(topic.toLowerCase())))
    : LEGAL_SECTIONS;

  const backPath = user ? (user.role === "inspector" ? "/enforce" : user.role === "manufacturer" ? "/prevent" : "/verify") : "/";

  return (
    <div className="min-h-screen bg-[#f0f2f7]">
      {/* Header */}
      {!user && (
        <header className="bg-[#1a2744] text-white">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-amber-400" />
              <span className="font-serif font-bold text-lg">LabelSure</span>
            </div>
            <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-white/70 hover:text-white">
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </header>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          {user && (
            <button
              onClick={() => navigate(backPath)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-2"
            >
              <ArrowLeft size={12} /> Back
            </button>
          )}
          <div className="flex items-center gap-3 mb-1">
            <BookOpen size={24} className="text-[#1a2744]" />
            <h1 className="font-serif text-2xl font-bold text-[#1a2744]">Legal Knowledge Base</h1>
          </div>
          <p className="text-sm text-gray-500">
            Sections of the Legal Metrology Act, 2009 (Act No. 1 of 2010) as used by the compliance engine.
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={14} className="text-gray-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setTopic(""); }}
              placeholder="Search section number, keyword..."
              className="text-sm flex-1 focus:outline-none"
            />
          </div>
          <select
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setQuery(""); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
          >
            <option value="">All Topics</option>
            {TOPICS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section list */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">{results.length} sections</span>
            </div>
            <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
              {results.map((s) => {
                const badge = BADGE_CONFIG[s.badge];
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      selected?.id === s.id ? "bg-[#1a2744]/5 border-l-2 border-[#1a2744]" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-mono text-xs font-bold text-[#1a2744]">§ {s.section_number}</div>
                      <span className={`text-[9px] font-mono border rounded px-1.5 py-0.5 ${badge.cls}`}>{badge.label}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-700 mt-0.5 leading-tight">{s.section_title}</div>
                  </button>
                );
              })}
              {results.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-400">No sections found.</div>
              )}
            </div>
          </div>

          {/* Section detail */}
          <div className="lg:col-span-2">
            {!selected ? (
              <div className="bg-white border border-gray-200 rounded-xl flex items-center justify-center h-40 text-gray-400">
                <div className="text-center text-sm">
                  <BookOpen size={24} className="mx-auto mb-2 text-gray-300" />
                  Select a section to view its text
                </div>
              </div>
            ) : (
              <SectionDetail section={selected} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionDetail({ section }: { section: LegalSection }) {
  const badge = BADGE_CONFIG[section.badge];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-[#1a2744] text-white px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-mono text-xs opacity-60 mb-1">Section {section.section_number}</div>
            <div className="font-serif text-lg font-bold">{section.section_title}</div>
          </div>
          <span className={`text-[10px] font-mono border rounded px-2 py-1 ${badge.cls}`}>{badge.label}</span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {/* Source metadata */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <div><span className="font-medium text-gray-600">Source:</span> {section.source_document}</div>
          <div><span className="font-medium text-gray-600">Page:</span> {section.source_page}</div>
          <div><span className="font-medium text-gray-600">Type:</span> {section.source_type}</div>
        </div>

        {/* Legal text */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Legal Text</div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line font-serif">
            {section.legal_text}
          </div>
        </div>

        {/* Applicable context */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Applicable Context</div>
          <div className="flex flex-wrap gap-1.5">
            {section.applicable_context.map((c) => (
              <span key={c} className="text-xs bg-gray-100 text-gray-600 rounded-full px-2.5 py-0.5 border border-gray-200">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Penalty info */}
        {section.penalty_information && (
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Penalty Information</div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 leading-relaxed">
              {section.penalty_information}
            </div>
          </div>
        )}

        {/* Rule-dependent notice */}
        {section.badge === "RULE_DEPENDENT" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700 leading-relaxed">
            <strong>RULE-DEPENDENT:</strong> This section delegates specifics to rules made under the Act. Detailed verification requires the applicable Legal Metrology Rules.
          </div>
        )}

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5">
          {section.topics.map((t) => (
            <span key={t} className="text-[10px] font-mono bg-[#1a2744]/5 text-[#1a2744] rounded px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
