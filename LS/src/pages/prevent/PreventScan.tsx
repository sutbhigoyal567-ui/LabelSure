import { useState } from "react";
import { useNavigate } from "react-router";
import ScanWorkflow from "../../components/ScanWorkflow";
import type { ScanResult } from "../../components/ScanWorkflow";
import { computeComplianceSummary } from "../../lib/complianceEngine";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export default function PreventScan() {
  const navigate = useNavigate();
  const [result, setResult] = useState<ScanResult | null>(null);

  const summary = result ? computeComplianceSummary(result.complianceFindings) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <nav className="text-xs text-gray-400 mb-2">
          <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate("/prevent")}>Dashboard</span>
          <span className="mx-1.5">›</span>
          <span className="text-gray-700">Scan Label</span>
        </nav>
        <h1 className="font-serif text-2xl font-bold text-emerald-900">Check Packaging Label</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Upload product artwork or label image to check for Legal Metrology Act compliance before market entry.
        </p>
      </div>

      <ScanWorkflow onComplete={setResult} userRole="manufacturer" />

      {result && summary && (
        <div className={`rounded-xl border p-4 ${
          summary.nonCompliant > 0
            ? "bg-red-50 border-red-200"
            : summary.verified > 0
            ? "bg-amber-50 border-amber-200"
            : "bg-green-50 border-green-200"
        }`}>
          <div className="flex items-start gap-3">
            {summary.nonCompliant > 0 ? (
              <AlertTriangle size={20} className="text-red-600 shrink-0 mt-0.5" />
            ) : summary.verified > 0 ? (
              <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-gray-800">
                {summary.fulfilled}/{summary.total} checks currently verified
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {summary.nonCompliant > 0
                  ? `${summary.nonCompliant} potential non-compliance finding(s) require immediate attention before market release.`
                  : summary.verified > 0
                  ? `${summary.verified} finding(s) require verification. Physical inspection or additional documentation may be needed.`
                  : "No major compliance issues detected from OCR extraction."}
              </div>
              <div className="flex items-start gap-1 mt-2 text-xs text-gray-500">
                <Info size={12} className="shrink-0 mt-0.5" />
                AI screening result — not a legal certification. Score is based on {summary.total} checks against the Legal Metrology Act, 2009.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
