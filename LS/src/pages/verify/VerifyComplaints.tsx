import { useNavigate } from "react-router";
import { FileText, Plus } from "lucide-react";
import { getComplaints } from "../../lib/store";
import { useAuth } from "../../lib/auth";

const STATUS_CONFIG = {
  draft: { label: "Draft", cls: "bg-gray-100 text-gray-600 border-gray-200" },
  submitted: { label: "Submitted", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  under_review: { label: "Under Review", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  action_required: { label: "Action Required", cls: "bg-orange-50 text-orange-700 border-orange-200" },
  resolved: { label: "Resolved", cls: "bg-green-50 text-green-700 border-green-200" },
};

const STAGES = ["Draft", "Submitted", "Under Review", "Action Required", "Resolved"];

export default function VerifyComplaints() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const complaints = getComplaints().filter((c) => c.consumerId === user?.id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-serif text-2xl font-bold text-violet-900">My Complaints</h1>
        <button
          onClick={() => navigate("/verify/scan")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-700 text-white text-xs font-semibold rounded-lg hover:bg-violet-800"
        >
          <Plus size={13} />
          New Report
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl py-12 text-center">
          <FileText size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-400">No complaints submitted yet.</p>
          <button
            onClick={() => navigate("/verify/scan")}
            className="mt-3 text-sm text-violet-600 hover:underline"
          >
            Scan a product to get started
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => {
            const sc = STATUS_CONFIG[c.status] || STATUS_CONFIG.draft;
            const stageIdx = STAGES.indexOf(sc.label);

            return (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <div className="font-mono text-xs text-gray-500">{c.complaintNumber}</div>
                    <div className="font-semibold text-gray-800 text-sm mt-0.5">{c.product}</div>
                  </div>
                  <span className={`border rounded-full text-xs font-medium px-2.5 py-0.5 ${sc.cls}`}>
                    {sc.label}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-400">Issue:</span> <span className="text-gray-700">{c.issueType}</span></div>
                    <div><span className="text-gray-400">Filed:</span> <span className="text-gray-700">{new Date(c.createdAt).toLocaleDateString("en-IN")}</span></div>
                    {c.purchaseLocation && (
                      <div className="col-span-2"><span className="text-gray-400">Location:</span> <span className="text-gray-700">{c.purchaseLocation}</span></div>
                    )}
                  </div>

                  {/* Stage tracker */}
                  <div className="flex items-center gap-1">
                    {STAGES.map((s, i) => (
                      <div key={s} className="flex items-center gap-1 flex-1">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          i <= stageIdx ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-400"
                        }`}>
                          {i + 1}
                        </div>
                        {i < STAGES.length - 1 && (
                          <div className={`h-0.5 flex-1 ${i < stageIdx ? "bg-violet-400" : "bg-gray-200"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1 overflow-x-auto pb-0.5">
                    {STAGES.map((s, i) => (
                      <span key={s} className={`text-[9px] font-mono shrink-0 ${i === stageIdx ? "text-violet-600 font-bold" : "text-gray-400"}`} style={{ width: `${100/STAGES.length}%`, textAlign: "center" }}>
                        {s.split(" ")[0]}
                      </span>
                    ))}
                  </div>

                  {c.description && (
                    <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2">
                      {c.description}
                    </div>
                  )}

                  <div className="text-[10px] text-gray-400 leading-relaxed">
                    DEMO DATA — Complaint status is illustrative. Use complaint details to approach official channels.
                  </div>

                  <button
                    onClick={() => window.open("https://consumerhelpline.gov.in", "_blank")}
                    className="text-xs text-violet-600 hover:underline"
                  >
                    Find Official Grievance Channel →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
