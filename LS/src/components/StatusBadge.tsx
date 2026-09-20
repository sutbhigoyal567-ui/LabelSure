import type { ComplianceFinding } from "../lib/store";

type Status = ComplianceFinding["status"];

const CONFIG: Record<Status, { label: string; bg: string; dot: string; text: string }> = {
  FULFILLED: {
    label: "FULFILLED",
    bg: "bg-green-50 border-green-200",
    dot: "bg-green-500",
    text: "text-green-700",
  },
  REQUIRES_VERIFICATION: {
    label: "REQUIRES VERIFICATION",
    bg: "bg-amber-50 border-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
  POTENTIAL_NON_COMPLIANCE: {
    label: "POTENTIAL NON-COMPLIANCE",
    bg: "bg-red-50 border-red-200",
    dot: "bg-red-500",
    text: "text-red-700",
  },
  RULE_DEPENDENT: {
    label: "RULE-DEPENDENT",
    bg: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
    text: "text-blue-700",
  },
};

export default function StatusBadge({
  status,
  size = "md",
}: {
  status: Status;
  size?: "sm" | "md";
}) {
  const c = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded-full font-mono font-medium ${c.bg} ${c.text} ${
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function InspectionStatusBadge({
  status,
}: {
  status: "draft" | "requires_verification" | "compliant" | "potential_non_compliant";
}) {
  const map = {
    draft: { label: "Draft", cls: "bg-gray-100 text-gray-600 border-gray-200" },
    requires_verification: { label: "Requires Verification", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    compliant: { label: "Compliant", cls: "bg-green-50 text-green-700 border-green-200" },
    potential_non_compliant: { label: "Potential Non-Compliant", cls: "bg-red-50 text-red-700 border-red-200" },
  };
  const c = map[status];
  return (
    <span className={`inline-block border rounded-full text-xs font-medium px-2.5 py-0.5 ${c.cls}`}>
      {c.label}
    </span>
  );
}
