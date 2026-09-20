import { useState } from "react";
import { useNavigate } from "react-router";
import { MapPin, Save, FileText, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { saveInspection, generateInspectionNumber } from "../../lib/store";
import type { ScanResult } from "../../components/ScanWorkflow";
import ScanWorkflow from "../../components/ScanWorkflow";
import { computeComplianceSummary } from "../../lib/complianceEngine";

export default function EnforceScan() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [location, setLocation] = useState("");
  const [product, setProduct] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleScanComplete = (r: ScanResult) => {
    setResult(r);
    // Auto-fill from extracted fields
    const p = r.extractedFields.find((f) => f.field === "Product Name");
    const m = r.extractedFields.find((f) => f.field === "Manufacturer");
    if (p?.detected) setProduct(p.value);
    if (m?.detected) setManufacturer(m.value);
  };

  const detectLocation = () => {
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(`Lat ${pos.coords.latitude.toFixed(4)}, Lng ${pos.coords.longitude.toFixed(4)}`);
        setDetectingLocation(false);
      },
      () => {
        setLocation("Location unavailable");
        setDetectingLocation(false);
      }
    );
  };

  const handleSave = () => {
    if (!result || !user) return;
    const summary = computeComplianceSummary(result.complianceFindings);
    const inspection = {
      id: crypto.randomUUID(),
      inspectionNumber: generateInspectionNumber(),
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 5),
      location: location || "Not recorded",
      inspectorId: user.id,
      inspectorName: user.name,
      product: product || "Unknown Product",
      manufacturer: manufacturer || "Unknown Manufacturer",
      imageUrls: result.imageDataUrl ? [result.imageDataUrl] : [],
      ocrText: result.ocrText,
      extractedFields: result.extractedFields,
      complianceFindings: result.complianceFindings,
      status: summary.overallStatus as any,
      inspectorNotes: notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveInspection(inspection);
    setSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <nav className="text-xs text-gray-400 mb-2">
          <span className="hover:text-gray-600 cursor-pointer" onClick={() => navigate("/enforce")}>Dashboard</span>
          <span className="mx-1.5">›</span>
          <span className="text-gray-700">Scan Product</span>
        </nav>
        <h1 className="font-serif text-2xl font-bold text-[#1a2744]">Scan Product Label</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upload a product label image for OCR extraction and legal compliance analysis.</p>
      </div>

      {/* Inspection metadata */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Product / SKU</label>
          <input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744]"
            placeholder="Auto-filled from OCR"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Manufacturer</label>
          <input
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744]"
            placeholder="Auto-filled from OCR"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">
            Inspection Location
            <span className="ml-1 text-gray-400">(with permission)</span>
          </label>
          <div className="flex gap-2">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744]"
              placeholder="Enter manually or detect"
            />
            <button
              onClick={detectLocation}
              disabled={detectingLocation}
              className="px-3 py-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
              title="Detect location"
            >
              <MapPin size={16} />
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Inspector Notes</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a2744]"
            placeholder="Optional notes"
          />
        </div>
      </div>

      {/* Scan workflow */}
      <ScanWorkflow onComplete={handleScanComplete} userRole="inspector" />

      {/* Save */}
      {result && !saved && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3">
          <div>
            <div className="font-medium text-gray-800">Save Inspection Record</div>
            <div className="text-xs text-gray-500 mt-0.5">Creates a persistent record with all findings and evidence.</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a2744] text-white text-sm font-semibold rounded-lg hover:bg-[#243258] transition-colors"
            >
              <Save size={15} />
              Save Inspection
            </button>
            <button
              onClick={() => navigate("/enforce/reports")}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText size={15} />
              Reports
            </button>
          </div>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
          <CheckCircle2 size={20} />
          <div>
            <div className="font-semibold">Inspection saved successfully.</div>
            <div className="text-xs mt-0.5">
              <button onClick={() => navigate("/enforce/inspections")} className="underline">View in Inspections</button>
              {" · "}
              <button onClick={() => navigate("/enforce/reports")} className="underline">Generate Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
