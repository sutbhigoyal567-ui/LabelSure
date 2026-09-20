import { useState } from "react";
import { FileText, Download, CheckCircle2 } from "lucide-react";
import { getInspections } from "../../lib/store";
import type { Inspection } from "../../lib/store";
import { InspectionStatusBadge } from "../../components/StatusBadge";
import StatusBadge from "../../components/StatusBadge";
import { computeComplianceSummary } from "../../lib/complianceEngine";

export default function EnforceReports() {
  const inspections = getInspections();
  const [selected, setSelected] = useState<Inspection | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <h1 className="font-serif text-2xl font-bold text-[#1a2744]">Inspection Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inspection selector */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Select Inspection</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
            {inspections.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">No inspections yet.</div>
            ) : (
              inspections.map((ins) => (
                <button
                  key={ins.id}
                  onClick={() => setSelected(ins)}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    selected?.id === ins.id ? "bg-[#1a2744]/5 border-l-2 border-[#1a2744]" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="text-xs font-mono text-gray-500">{ins.inspectionNumber}</div>
                  <div className="text-sm font-medium text-gray-800 mt-0.5">{ins.product}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{ins.date}</div>
                  <div className="mt-1"><InspectionStatusBadge status={ins.status} /></div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Report preview */}
        <div className="lg:col-span-2">
          {!selected ? (
            <div className="bg-white border border-gray-200 rounded-xl flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <FileText size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Select an inspection to generate a report</p>
              </div>
            </div>
          ) : (
            <ReportView inspection={selected} />
          )}
        </div>
      </div>
    </div>
  );
}

function ReportView({ inspection }: { inspection: Inspection }) {
  const [remarks, setRemarks] = useState(inspection.inspectorNotes || "");
  const [exported, setExported] = useState(false);
  const summary = computeComplianceSummary(inspection.complianceFindings);

  const exportCSV = () => {
    const rows = [
      ["Field", "Value"],
      ["Inspection ID", inspection.inspectionNumber],
      ["Date", inspection.date],
      ["Location", inspection.location],
      ["Inspector", inspection.inspectorName],
      ["Product", inspection.product],
      ["Manufacturer", inspection.manufacturer],
      ["Overall Status", inspection.status],
      [""],
      ["Requirement", "Status", "Evidence", "Legal Basis", "Confidence"],
      ...inspection.complianceFindings.map((f) => [
        f.requirement,
        f.status,
        f.evidence,
        f.legalBasis,
        `${Math.round(f.confidence * 100)}%`,
      ]),
      [""],
      ["Inspector Remarks", remarks],
      [""],
      ["DISCLAIMER", "AI-assisted screening. Final legal determination remains with the competent authority."],
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inspection.inspectionNumber}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Report header */}
      <div className="bg-[#1a2744] text-white px-6 py-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-mono opacity-60 mb-1">LEGAL METROLOGY INSPECTION REPORT</div>
            <div className="font-serif text-xl font-bold">{inspection.inspectionNumber}</div>
            <div className="text-sm opacity-75 mt-0.5">Legal Metrology Act, 2009 — AI-Assisted Screening</div>
          </div>
          <InspectionStatusBadge status={inspection.status} />
        </div>
      </div>

      <div className="p-5 space-y-5 text-sm">
        {/* 1. Inspection details */}
        <section>
          <h3 className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-2">1. Inspection Details</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-400">Date:</span> {inspection.date}</div>
            <div><span className="text-gray-400">Time:</span> {inspection.time}</div>
            <div><span className="text-gray-400">Location:</span> {inspection.location}</div>
            <div><span className="text-gray-400">Inspector:</span> {inspection.inspectorName}</div>
          </div>
        </section>

        {/* 2. Product information */}
        <section>
          <h3 className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-2">2. Product Information</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-400">Product:</span> {inspection.product}</div>
            <div><span className="text-gray-400">Manufacturer:</span> {inspection.manufacturer}</div>
          </div>
        </section>

        {/* 3. Compliance summary */}
        <section>
          <h3 className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-2">3. Compliance Summary</h3>
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            <span className="bg-green-50 text-green-700 border border-green-200 rounded px-2 py-0.5">{summary.fulfilled} Fulfilled</span>
            <span className="bg-amber-50 text-amber-700 border border-amber-200 rounded px-2 py-0.5">{summary.verified} Requires Verification</span>
            <span className="bg-red-50 text-red-700 border border-red-200 rounded px-2 py-0.5">{summary.nonCompliant} Potential Non-Compliance</span>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-0.5">{summary.ruleDependent} Rule-Dependent</span>
          </div>
          <div className="space-y-2">
            {inspection.complianceFindings.map((f) => (
              <div key={f.id} className="flex gap-2 text-xs">
                <StatusBadge status={f.status} size="sm" />
                <div>
                  <div className="font-medium text-gray-700">{f.requirement}</div>
                  <div className="text-gray-500 mt-0.5">{f.explanation}</div>
                  <div className="text-blue-600 font-mono mt-0.5">{f.legalBasis}</div>
                  {f.penaltyInfo && <div className="text-red-600 mt-0.5">{f.penaltyInfo}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Inspector remarks */}
        <section>
          <h3 className="font-semibold text-gray-700 text-xs uppercase tracking-wider mb-2">4. Inspector Remarks</h3>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-2.5 text-xs text-gray-700 resize-none h-20 focus:outline-none focus:border-[#1a2744]"
            placeholder="Add remarks..."
          />
        </section>

        {/* Disclaimer */}
        <div className="text-[10px] text-gray-400 bg-gray-50 border border-gray-200 rounded p-2.5 leading-relaxed">
          AI-assisted screening result — not a legal certification. Final legal determination remains with the competent authority under the Legal Metrology Act, 2009. This report is generated from OCR extraction and deterministic rule evaluation.
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2744] text-white text-xs font-semibold rounded-lg hover:bg-[#243258]"
          >
            <Download size={13} />
            Export CSV
          </button>
          {exported && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 size={12} />
              Downloaded
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
