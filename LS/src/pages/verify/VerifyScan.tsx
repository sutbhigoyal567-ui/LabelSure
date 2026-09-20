import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle2, AlertTriangle, ArrowRight, FileText } from "lucide-react";
import ScanWorkflow from "../../components/ScanWorkflow";
import type { ScanResult } from "../../components/ScanWorkflow";
import { computeComplianceSummary } from "../../lib/complianceEngine";
import type { ExtractedField, ComplianceFinding } from "../../lib/store";
import { useAuth } from "../../lib/auth";
import { saveComplaint, generateComplaintNumber } from "../../lib/store";

const ISSUE_TYPES = [
  "Potential incorrect MRP",
  "Potential quantity discrepancy",
  "Missing declaration",
  "Suspicious label information",
  "Other packaging concern",
];

export default function VerifyScan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showReport, setShowReport] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <nav className="text-xs text-gray-400 mb-2">
          <span className="cursor-pointer hover:text-gray-600" onClick={() => navigate("/verify")}>Home</span>
          <span className="mx-1.5">›</span>
          <span className="text-gray-700">Scan Product</span>
        </nav>
        <h1 className="font-serif text-2xl font-bold text-violet-900">Scan Product Label</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upload a product label to see key information and potential issues.</p>
      </div>

      <ScanWorkflow onComplete={setResult} userRole="consumer" />

      {result && !showReport && (
        <ConsumerSummary
          fields={result.extractedFields}
          findings={result.complianceFindings}
          onReport={() => setShowReport(true)}
        />
      )}

      {result && showReport && user && (
        <ComplaintForm
          result={result}
          user={user}
          onBack={() => setShowReport(false)}
          onDone={() => navigate("/verify/complaints")}
        />
      )}
    </div>
  );
}

function ConsumerSummary({
  fields,
  findings,
  onReport,
}: {
  fields: ExtractedField[];
  findings: ComplianceFinding[];
  onReport: () => void;
}) {
  const summary = computeComplianceSummary(findings);
  const hasIssue = summary.nonCompliant > 0 || summary.verified > 1;

  const keyFields = ["Product Name", "MRP", "Net Quantity", "Manufacturer", "Country of Origin"];
  const shown = keyFields.map((k) => fields.find((f) => f.field === k)).filter(Boolean) as ExtractedField[];

  return (
    <div className="space-y-4">
      {/* Status banner */}
      <div className={`rounded-xl p-4 flex items-start gap-3 ${hasIssue ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"}`}>
        {hasIssue ? (
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
        )}
        <div>
          <div className={`font-semibold ${hasIssue ? "text-amber-800" : "text-green-800"}`}>
            {hasIssue ? "🟠 Potential issue detected" : "🟢 No major issue detected"}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {hasIssue
              ? "One or more aspects of this label require further verification. Tap 'View Details' or 'Report Issue' below."
              : "Based on OCR extraction, no major compliance issue was detected. This is an AI screening result — not a legal certification."}
          </div>
        </div>
      </div>

      {/* Key information */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Product Information</span>
        </div>
        <div className="divide-y divide-gray-50">
          {shown.map((f) => (
            <div key={f.field} className="px-4 py-2.5 flex justify-between">
              <span className="text-xs text-gray-500">{f.field}</span>
              <span className={`text-sm font-medium ${f.detected ? "text-gray-800" : "text-gray-400 italic"}`}>
                {f.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReport}
        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-amber-400 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors text-sm"
      >
        <FileText size={16} />
        Report an Issue
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

function ComplaintForm({
  result,
  user,
  onBack,
  onDone,
}: {
  result: ScanResult;
  user: { id: string; name: string };
  onBack: () => void;
  onDone: () => void;
}) {
  const productField = result.extractedFields.find((f) => f.field === "Product Name");
  const mfrField = result.extractedFields.find((f) => f.field === "Manufacturer");

  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [description, setDescription] = useState("");
  const [purchaseLocation, setPurchaseLocation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [complaintNum, setComplaintNum] = useState("");
  const [editMode, setEditMode] = useState(true);

  const handleSubmit = () => {
    const num = generateComplaintNumber();
    const complaint = {
      id: crypto.randomUUID(),
      complaintNumber: num,
      consumerId: user.id,
      consumerName: user.name,
      product: productField?.value || "Unknown Product",
      manufacturer: mfrField?.value || "Unknown",
      issueType,
      description,
      purchaseLocation,
      imageUrls: result.imageDataUrl ? [result.imageDataUrl] : [],
      ocrText: result.ocrText,
      extractedFields: result.extractedFields,
      aiFindings: result.complianceFindings.map((f) => `${f.requirement}: ${f.status}`).join("; "),
      legalReference: result.complianceFindings.map((f) => f.legalBasis).join("; "),
      status: "submitted" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveComplaint(complaint);
    setComplaintNum(num);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 text-center space-y-3">
        <CheckCircle2 size={32} className="mx-auto text-green-500" />
        <div className="font-semibold text-gray-800">Complaint Submitted</div>
        <div className="font-mono text-sm text-violet-700">{complaintNum}</div>
        <p className="text-xs text-gray-500 leading-relaxed">
          LabelSure helps you identify and document a potential issue. You can use this information to approach the appropriate official grievance mechanism.
        </p>
        <button
          onClick={() => window.open("https://consumerhelpline.gov.in", "_blank")}
          className="w-full py-2 border border-violet-300 text-violet-700 font-semibold rounded-lg text-sm hover:bg-violet-50"
        >
          Find Official Grievance Channel
        </button>
        <button
          onClick={onDone}
          className="w-full py-2 bg-violet-700 text-white font-semibold rounded-lg text-sm hover:bg-violet-800"
        >
          Track My Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-gray-700">Report an Issue</h2>
        <button onClick={onBack} className="text-xs text-gray-400 hover:text-gray-600">← Back</button>
      </div>
      <div className="p-4 space-y-4">
        {/* Pre-filled */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1">
          <div><span className="text-gray-400">Product:</span> <span className="font-medium text-gray-700">{productField?.value || "Unknown"}</span></div>
          <div><span className="text-gray-400">Manufacturer:</span> <span className="font-medium text-gray-700">{mfrField?.value || "Unknown"}</span></div>
          <div><span className="text-gray-400">AI Finding:</span> <span className="font-medium text-gray-700">{result.complianceFindings[0]?.status || "—"}</span></div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Issue Type</label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
          >
            {ISSUE_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:outline-none"
            placeholder="Describe the issue you observed..."
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Purchase / Store Location</label>
          <input
            value={purchaseLocation}
            onChange={(e) => setPurchaseLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
            placeholder="Store name and location"
          />
        </div>

        <div className="text-xs text-gray-400 bg-amber-50 border border-amber-200 rounded p-2.5">
          LabelSure helps you identify and document a potential issue. This is not a legal complaint submission to a Consumer Court. You can use this complaint draft to approach an official grievance mechanism.
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 bg-violet-700 text-white font-semibold text-sm rounded-lg hover:bg-violet-800"
          >
            Confirm &amp; Submit
          </button>
          <button
            onClick={onBack}
            className="px-4 py-2.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
