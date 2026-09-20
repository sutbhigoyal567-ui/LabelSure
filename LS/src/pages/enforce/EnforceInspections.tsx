import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Search, Filter, ArrowLeft, FileText, Edit3, CheckCircle2 } from "lucide-react";
import { getInspections, getInspectionById, saveInspection } from "../../lib/store";
import { InspectionStatusBadge } from "../../components/StatusBadge";
import StatusBadge from "../../components/StatusBadge";

export default function EnforceInspections() {
  const { id } = useParams();
  if (id) return <InspectionDetail id={id} />;
  return <InspectionList />;
}

function InspectionList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const inspections = getInspections();

  const filtered = inspections.filter((i) => {
    const matchSearch =
      !search ||
      i.product.toLowerCase().includes(search.toLowerCase()) ||
      i.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      i.inspectionNumber.toLowerCase().includes(search.toLowerCase()) ||
      i.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <h1 className="font-serif text-2xl font-bold text-[#1a2744]">Inspection History</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product, manufacturer, location..."
            className="text-sm flex-1 focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="compliant">Compliant</option>
          <option value="requires_verification">Requires Verification</option>
          <option value="potential_non_compliant">Potential Non-Compliant</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">No inspections found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">ID</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Product</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hidden md:table-cell">Manufacturer</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 hidden lg:table-cell">Location</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500">Status</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((ins) => (
                  <tr key={ins.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{ins.inspectionNumber}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{ins.product}</td>
                    <td className="px-4 py-3 text-xs text-gray-600 hidden md:table-cell">{ins.manufacturer}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{ins.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{ins.location}</td>
                    <td className="px-4 py-3"><InspectionStatusBadge status={ins.status} /></td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/enforce/inspections/${ins.id}`)}
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
        )}
      </div>
    </div>
  );
}

function InspectionDetail({ id }: { id: string }) {
  const navigate = useNavigate();
  const inspection = getInspectionById(id);
  const [notes, setNotes] = useState(inspection?.inspectorNotes || "");
  const [editingNotes, setEditingNotes] = useState(false);
  const [status, setStatus] = useState(inspection?.status || "draft");
  const [saved, setSaved] = useState(false);

  if (!inspection) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center py-12 text-gray-400">Inspection not found.</div>
      </div>
    );
  }

  const handleSaveNotes = () => {
    saveInspection({ ...inspection, inspectorNotes: notes, status: status as any, updatedAt: new Date().toISOString() });
    setEditingNotes(false);
    setSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <button
          onClick={() => navigate("/enforce/inspections")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          <ArrowLeft size={14} />
          Back to Inspections
        </button>
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1a2744]">{inspection.inspectionNumber}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{inspection.product} — {inspection.manufacturer}</p>
          </div>
          <InspectionStatusBadge status={status as any} />
        </div>
      </div>

      {/* Details grid */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        <Field label="Date" value={inspection.date} />
        <Field label="Time" value={inspection.time} />
        <Field label="Location" value={inspection.location} />
        <Field label="Inspector" value={inspection.inspectorName} />
        <Field label="Product" value={inspection.product} />
        <Field label="Manufacturer" value={inspection.manufacturer} />
      </div>

      {/* OCR Text */}
      {inspection.ocrText && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-700">OCR Extracted Text</span>
          </div>
          <pre className="p-4 text-xs font-mono text-gray-600 bg-gray-50 whitespace-pre-wrap max-h-40 overflow-y-auto">
            {inspection.ocrText}
          </pre>
        </div>
      )}

      {/* Extracted fields */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Extracted Product Information</span>
        </div>
        <div className="divide-y divide-gray-50">
          {inspection.extractedFields.map((f) => (
            <div key={f.field} className="px-4 py-2.5 flex justify-between">
              <div>
                <div className="text-xs text-gray-400">{f.field}</div>
                <div className={`text-sm font-medium ${f.detected ? "text-gray-800" : "text-gray-400 italic"}`}>{f.value}</div>
              </div>
              {f.detected && (
                <span className="text-xs font-mono text-gray-400">{Math.round(f.confidence * 100)}%</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compliance findings */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Compliance Findings</span>
        </div>
        <div className="divide-y divide-gray-50">
          {inspection.complianceFindings.map((f) => (
            <div key={f.id} className="px-4 py-3 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-800">{f.requirement}</span>
                <StatusBadge status={f.status} size="sm" />
              </div>
              <div className="text-xs text-gray-600">{f.explanation}</div>
              <div className="text-xs font-mono text-blue-600">{f.legalBasis}</div>
              {f.penaltyInfo && (
                <div className="text-xs text-red-600 bg-red-50 rounded px-2 py-1">{f.penaltyInfo}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inspector actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-gray-700">Inspector Actions</h2>
          {saved && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 size={12} />
              Saved
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="requires_verification">Requires Verification</option>
              <option value="compliant">Compliant</option>
              <option value="potential_non_compliant">Potential Non-Compliant</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Inspector Notes</label>
            {editingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none h-16 resize-none"
              />
            ) : (
              <div
                onClick={() => setEditingNotes(true)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-gray-50 min-h-9 cursor-text"
              >
                {notes || <span className="text-gray-400">Click to add notes...</span>}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSaveNotes}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a2744] text-white text-xs font-semibold rounded-lg hover:bg-[#243258]"
          >
            <CheckCircle2 size={13} />
            Save & Finalize
          </button>
          <button
            onClick={() => navigate("/enforce/reports")}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg hover:bg-gray-50"
          >
            <FileText size={13} />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-gray-400 mb-0.5">{label}</div>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  );
}
