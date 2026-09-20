import { useState, useRef, useCallback } from "react";
import { Upload, Camera, Loader2, CheckCircle2, AlertTriangle, Info, Eye, FileText } from "lucide-react";
import { createWorker } from "tesseract.js";
import { extractFields, evaluateCompliance, computeComplianceSummary } from "../lib/complianceEngine";
import type { ExtractedField, ComplianceFinding } from "../lib/store";
import StatusBadge from "./StatusBadge";
import { getSectionByNumber } from "../lib/legal";

interface ScanWorkflowProps {
  onComplete?: (result: ScanResult) => void;
  userRole: "inspector" | "manufacturer" | "consumer";
}

export interface ScanResult {
  imageDataUrl: string;
  ocrText: string;
  extractedFields: ExtractedField[];
  complianceFindings: ComplianceFinding[];
  processingMethod: "OCR_BASED";
}

type Step = "idle" | "uploading" | "preprocessing" | "ocr" | "extraction" | "legal" | "evidence" | "done" | "error";

const STEPS = [
  { key: "preprocessing", label: "Image Processing", icon: "🖼️" },
  { key: "ocr", label: "OCR Extraction", icon: "🔍" },
  { key: "extraction", label: "Information Extraction", icon: "🧩" },
  { key: "legal", label: "Legal Compliance Analysis", icon: "⚖️" },
  { key: "evidence", label: "Evidence Linking", icon: "🔗" },
  { key: "done", label: "Explainable Result", icon: "✅" },
];

export default function ScanWorkflow({ onComplete, userRole }: ScanWorkflowProps) {
  const [step, setStep] = useState<Step>("idle");
  const [progress, setProgress] = useState(0);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const [extractedFields, setExtractedFields] = useState<ExtractedField[]>([]);
  const [findings, setFindings] = useState<ComplianceFinding[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<ComplianceFinding | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (file: File) => {
    try {
      setError(null);
      setStep("uploading");

      const dataUrl = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      setImageDataUrl(dataUrl);

      await delay(400);
      setStep("preprocessing");
      await delay(600);

      setStep("ocr");
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round((m.progress || 0) * 100));
          }
        },
      });
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const text = data.text || "";
      setOcrText(text);

      setStep("extraction");
      await delay(500);
      const fields = extractFields(text);
      setExtractedFields(fields);

      setStep("legal");
      await delay(700);
      const complianceFindings = evaluateCompliance(fields);
      setFindings(complianceFindings);

      setStep("evidence");
      await delay(400);

      setStep("done");

      onComplete?.({
        imageDataUrl: dataUrl,
        ocrText: text,
        extractedFields: fields,
        complianceFindings,
        processingMethod: "OCR_BASED",
      });
    } catch (err) {
      console.error(err);
      setError("Processing failed. Please try a clearer image.");
      setStep("error");
    }
  }, [onComplete]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Unsupported file type. Please upload an image (JPEG, PNG, WebP).");
      setStep("error");
      return;
    }
    processImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setStep("idle");
    setProgress(0);
    setImageDataUrl(null);
    setOcrText("");
    setExtractedFields([]);
    setFindings([]);
    setSelectedFinding(null);
    setError(null);
  };

  if (step === "idle" || step === "error") {
    return (
      <div className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
            isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-white"
          }`}
        >
          <Upload size={32} className="mx-auto text-gray-400 mb-3" />
          <p className="font-medium text-gray-700">Drag &amp; drop a product label image</p>
          <p className="text-sm text-gray-400 mt-1">JPEG, PNG, WebP — clear photographs recommended</p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 bg-[#1a2744] text-white rounded-lg text-sm font-medium hover:bg-[#243258] transition-colors"
            >
              <Upload size={14} className="inline mr-1.5" />
              Upload Image
            </button>
            <button
              onClick={() => {
                if (fileRef.current) {
                  fileRef.current.capture = "environment";
                  fileRef.current.accept = "image/*";
                  fileRef.current.click();
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Camera size={14} className="inline mr-1.5" />
              Camera
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}
      </div>
    );
  }

  const stepsDone = STEPS.findIndex((s) => s.key === step);

  if (step !== "done") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {imageDataUrl && (
          <div className="flex justify-center">
            <img src={imageDataUrl} alt="Uploaded label" className="max-h-48 rounded-lg border border-gray-200 object-contain" />
          </div>
        )}
        <div className="space-y-3">
          {STEPS.map((s, i) => {
            const done = i < stepsDone;
            const active = s.key === step;
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 transition-all ${
                  done ? "bg-green-100 text-green-600" : active ? "bg-[#1a2744] text-white" : "bg-gray-100 text-gray-400"
                }`}>
                  {done ? <CheckCircle2 size={16} /> : active ? <Loader2 size={16} className="animate-spin" /> : i + 1}
                </div>
                <div className={`text-sm font-medium ${done ? "text-green-600" : active ? "text-[#1a2744]" : "text-gray-400"}`}>
                  {s.label}
                  {active && s.key === "ocr" && progress > 0 && (
                    <span className="ml-2 text-xs text-gray-400 font-normal">{progress}%</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-center text-gray-400">
          Processing via OCR — AI-assisted screening, not legal determination
        </p>
      </div>
    );
  }

  // Results
  const summary = computeComplianceSummary(findings);

  return (
    <div className="space-y-6">
      {/* Processing badge */}
      <div className="inline-flex items-center gap-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-full px-3 py-1">
        <Info size={12} />
        OCR-based extraction — AI-assisted screening
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Eye size={14} />Label Image</span>
            <button onClick={reset} className="text-xs text-blue-600 hover:underline">New Scan</button>
          </div>
          {imageDataUrl && (
            <img src={imageDataUrl} alt="Label" className="w-full max-h-64 object-contain p-2" />
          )}
          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-semibold mb-1.5 flex items-center gap-1"><FileText size={12} />OCR Extracted Text</p>
            <pre className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded border border-gray-200 max-h-36 overflow-y-auto whitespace-pre-wrap">
              {ocrText || "(No text detected — try a clearer image)"}
            </pre>
          </div>
        </div>

        {/* Extracted fields */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Extracted Product Information</span>
          </div>
          <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
            {extractedFields.map((f) => (
              <div key={f.field} className="px-4 py-2.5 flex justify-between items-start gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium">{f.field}</div>
                  <div className={`text-sm font-semibold mt-0.5 ${f.detected ? "text-gray-800" : "text-gray-400 italic"}`}>
                    {f.value}
                  </div>
                  {f.detected && f.source && (
                    <div className="text-[10px] text-gray-400 mt-0.5">{f.source}</div>
                  )}
                </div>
                {f.detected && (
                  <span className={`text-xs font-mono shrink-0 rounded px-1.5 py-0.5 ${
                    f.confidence >= 0.85 ? "bg-green-50 text-green-600" : f.confidence >= 0.7 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-500"
                  }`}>
                    {Math.round(f.confidence * 100)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Compliance Analysis — Legal Metrology Act, 2009</span>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">{summary.fulfilled} Fulfilled</span>
            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">{summary.verified} Verify</span>
            {summary.nonCompliant > 0 && <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-200">{summary.nonCompliant} Potential Non-Compliance</span>}
            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">{summary.ruleDependent} Rule-Dep.</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Requirement</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hidden md:table-cell">Evidence</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hidden md:table-cell">Legal Basis</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Confidence</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {findings.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 text-sm">{f.requirement}</td>
                  <td className="px-4 py-3"><StatusBadge status={f.status} size="sm" /></td>
                  <td className="px-4 py-3 text-xs text-gray-600 hidden md:table-cell max-w-[160px]">{f.evidence}</td>
                  <td className="px-4 py-3 text-xs text-blue-600 hidden md:table-cell font-mono">{f.legalBasisSection?.replace("s", "§ ")}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-600">{Math.round(f.confidence * 100)}%</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedFinding(selectedFinding?.id === f.id ? null : f)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence detail */}
      {selectedFinding && (
        <FindingDetail finding={selectedFinding} onClose={() => setSelectedFinding(null)} />
      )}

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <span>
          <strong>AI screening result — not a legal certification.</strong>{" "}
          {userRole === "inspector"
            ? "Findings marked 'Requires Human Verification' must be confirmed by an authorized Legal Metrology Inspector before any enforcement action."
            : "This is an AI-assisted screening result. Final legal determination remains with the competent authority."}
        </span>
      </div>
    </div>
  );
}

function FindingDetail({ finding, onClose }: { finding: ComplianceFinding; onClose: () => void }) {
  const section = finding.legalBasisSection ? getSectionByNumber(finding.legalBasisSection.replace("s", "")) : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700">Evidence Detail</span>
        <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-600">Close</button>
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Requirement</div>
            <div className="text-sm font-medium text-gray-800">{finding.requirement}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Status</div>
            <StatusBadge status={finding.status} />
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Confidence</div>
            <div className="text-sm font-mono">{Math.round(finding.confidence * 100)}%</div>
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Extracted Evidence</div>
          <div className="bg-gray-50 border border-gray-200 rounded p-2.5 text-sm font-mono text-gray-700">
            {finding.evidence}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Legal Basis</div>
          <div className="text-sm font-medium text-blue-700">{finding.legalBasis}</div>
          {section && (
            <div className="mt-2 bg-blue-50 border border-blue-100 rounded p-3 text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {section.legal_text}
            </div>
          )}
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Reasoning</div>
          <div className="text-sm text-gray-700 leading-relaxed">{finding.explanation}</div>
        </div>
        {finding.penaltyInfo && (
          <div className="bg-red-50 border border-red-100 rounded p-3">
            <div className="text-xs text-red-500 font-semibold mb-1">Potential Penalty Reference (if confirmed by competent authority)</div>
            <div className="text-xs text-red-700">{finding.penaltyInfo}</div>
          </div>
        )}
        {finding.requires_human_verification && (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2.5">
            <AlertTriangle size={14} />
            This finding requires human verification by an authorized inspector.
          </div>
        )}
        {finding.status === "RULE_DEPENDENT" && (
          <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded p-2.5">
            <Info size={14} className="shrink-0 mt-0.5" />
            <span>
              <strong>RULE-DEPENDENT:</strong> Detailed verification requires the applicable Legal Metrology (Packaged Commodities) Rules, which are not part of the Legal Metrology Act, 2009 itself.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
