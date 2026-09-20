import { Link } from "react-router";
import { useAuth } from "../../lib/auth";
import { Scan, FileText, ShoppingBag, ArrowRight } from "lucide-react";
import { getComplaints } from "../../lib/store";

const COMPLAINT_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  action_required: "Action Required",
  resolved: "Resolved",
};

export default function VerifyDashboard() {
  const { user } = useAuth();
  const complaints = getComplaints().filter((c) => c.consumerId === user?.id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Hero */}
      <div className="bg-violet-800 text-white rounded-xl p-6">
        <div className="text-xs font-mono opacity-60 mb-1">VERIFY</div>
        <h1 className="font-serif text-2xl font-bold mb-2">Verify Your Products</h1>
        <p className="text-sm text-white/75 mb-4">
          Scan a product label to understand key declarations and report potential issues.
        </p>
        <Link
          to="/verify/scan"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-violet-800 font-semibold text-sm rounded-lg hover:bg-violet-50 transition-colors"
        >
          <Scan size={16} />
          Scan Product
        </Link>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/verify/scan"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
            <Scan size={18} className="text-violet-700" />
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm">Scan Product</div>
            <div className="text-xs text-gray-400 mt-0.5">Upload label image for analysis</div>
          </div>
          <ArrowRight size={14} className="ml-auto text-gray-400" />
        </Link>
        <Link
          to="/verify/complaints"
          className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <FileText size={18} className="text-amber-700" />
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm">My Complaints</div>
            <div className="text-xs text-gray-400 mt-0.5">{complaints.length} complaint(s)</div>
          </div>
          <ArrowRight size={14} className="ml-auto text-gray-400" />
        </Link>
      </div>

      {/* Recent complaints */}
      {complaints.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-gray-700">Recent Complaints</h2>
            <Link to="/verify/complaints" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {complaints.slice(0, 3).map((c) => (
              <div key={c.id} className="px-4 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-mono text-xs text-gray-500">{c.complaintNumber}</div>
                    <div className="text-sm font-medium text-gray-800 mt-0.5">{c.product}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{c.issueType}</div>
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">
                    {COMPLAINT_STATUS_LABELS[c.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg p-3 leading-relaxed">
        LabelSure helps you identify and document a potential issue. You can use the generated complaint information to approach the appropriate official grievance mechanism. LabelSure is not a Consumer Court.
      </div>
    </div>
  );
}
