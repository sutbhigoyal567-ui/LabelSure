// Persistent in-memory store backed by localStorage

export type Role = "inspector" | "manufacturer" | "consumer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organization: string;
}

export interface Inspection {
  id: string;
  inspectionNumber: string;
  date: string;
  time: string;
  location: string;
  inspectorId: string;
  inspectorName: string;
  product: string;
  manufacturer: string;
  imageUrls: string[];
  ocrText: string;
  extractedFields: ExtractedField[];
  complianceFindings: ComplianceFinding[];
  status: "draft" | "requires_verification" | "compliant" | "potential_non_compliant";
  inspectorNotes: string;
  finalStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExtractedField {
  field: string;
  value: string;
  confidence: number;
  source: string;
  detected: boolean;
}

export interface ComplianceFinding {
  id: string;
  requirement: string;
  status: "FULFILLED" | "REQUIRES_VERIFICATION" | "POTENTIAL_NON_COMPLIANCE" | "RULE_DEPENDENT";
  evidence: string;
  legalBasis: string;
  legalBasisSection: string;
  confidence: number;
  explanation: string;
  requires_human_verification: boolean;
  penaltyInfo?: string;
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  consumerId: string;
  consumerName: string;
  product: string;
  manufacturer: string;
  issueType: string;
  description: string;
  purchaseLocation: string;
  imageUrls: string[];
  ocrText: string;
  extractedFields: ExtractedField[];
  aiFindings: string;
  legalReference: string;
  status: "draft" | "submitted" | "under_review" | "action_required" | "resolved";
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "violation" | "verification" | "pattern" | "rescan" | "complaint" | "update";
  read: boolean;
  createdAt: string;
  targetRole: Role;
}

function load<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// Demo users
const DEMO_USERS: User[] = [
  {
    id: "u1",
    name: "Rajesh Kumar",
    email: "inspector@labelsure.gov.in",
    role: "inspector",
    organization: "Legal Metrology Department, Delhi",
  },
  {
    id: "u2",
    name: "Priya Sharma",
    email: "manufacturer@labelsure.com",
    role: "manufacturer",
    organization: "XYZ Foods Pvt. Ltd.",
  },
  {
    id: "u3",
    name: "Amit Patel",
    email: "consumer@labelsure.com",
    role: "consumer",
    organization: "",
  },
];

export function getDemoUsers(): User[] {
  return DEMO_USERS;
}

export function getUserByEmail(email: string): User | undefined {
  return DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// Inspections
export function getInspections(): Inspection[] {
  return load<Inspection[]>("ls_inspections", getDemoInspections());
}

export function saveInspection(inspection: Inspection): void {
  const all = getInspections();
  const idx = all.findIndex((i) => i.id === inspection.id);
  if (idx >= 0) {
    all[idx] = inspection;
  } else {
    all.unshift(inspection);
  }
  save("ls_inspections", all);
  addNotification({
    id: crypto.randomUUID(),
    title: "New Inspection Saved",
    message: `Inspection ${inspection.inspectionNumber} for ${inspection.product} has been saved.`,
    type: inspection.status === "potential_non_compliant" ? "violation" : "verification",
    read: false,
    createdAt: new Date().toISOString(),
    targetRole: "inspector",
  });
}

export function getInspectionById(id: string): Inspection | undefined {
  return getInspections().find((i) => i.id === id);
}

export function generateInspectionNumber(): string {
  const existing = getInspections();
  const num = existing.length + 1;
  return `LM-${new Date().getFullYear()}-${String(num).padStart(5, "0")}`;
}

// Complaints
export function getComplaints(): Complaint[] {
  return load<Complaint[]>("ls_complaints", []);
}

export function saveComplaint(complaint: Complaint): void {
  const all = getComplaints();
  const idx = all.findIndex((c) => c.id === complaint.id);
  if (idx >= 0) {
    all[idx] = complaint;
  } else {
    all.unshift(complaint);
  }
  save("ls_complaints", all);
}

export function generateComplaintNumber(): string {
  const existing = getComplaints();
  const num = existing.length + 1;
  return `LS-C-${new Date().getFullYear()}-${String(num).padStart(5, "0")}`;
}

// Notifications
export function getNotifications(role: Role): Notification[] {
  const all = load<Notification[]>("ls_notifications", getDemoNotifications());
  return all.filter((n) => n.targetRole === role);
}

export function addNotification(n: Notification): void {
  const all = load<Notification[]>("ls_notifications", getDemoNotifications());
  all.unshift(n);
  save("ls_notifications", all);
}

export function markAllRead(role: Role): void {
  const all = load<Notification[]>("ls_notifications", getDemoNotifications());
  const updated = all.map((n) => (n.targetRole === role ? { ...n, read: true } : n));
  save("ls_notifications", updated);
}

function getDemoNotifications(): Notification[] {
  return [
    {
      id: "n1",
      title: "Potential violation detected",
      message: "Inspection LM-2026-00001 flagged a potential non-standard unit representation.",
      type: "violation",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      targetRole: "inspector",
    },
    {
      id: "n2",
      title: "Inspection requires verification",
      message: "LM-2026-00002 has fields requiring human verification.",
      type: "verification",
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      targetRole: "inspector",
    },
    {
      id: "n3",
      title: "Compliance analysis complete",
      message: "Your packaging for XYZ Premium Rice has been analyzed.",
      type: "rescan",
      read: false,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      targetRole: "manufacturer",
    },
  ];
}

function getDemoInspections(): Inspection[] {
  return [
    {
      id: "demo-1",
      inspectionNumber: "LM-2026-00001",
      date: "2026-09-05",
      time: "10:30",
      location: "New Delhi Market, Chandni Chowk",
      inspectorId: "u1",
      inspectorName: "Rajesh Kumar",
      product: "XYZ Premium Rice 5kg",
      manufacturer: "XYZ Foods Pvt. Ltd.",
      imageUrls: [],
      ocrText: "XYZ Premium Rice\nNet Qty: 5 kg\nMRP: Rs. 280\nManufactured by: XYZ Foods Pvt. Ltd.\nAddress: Plot 12, Industrial Area, Noida, UP",
      extractedFields: [
        { field: "Product Name", value: "XYZ Premium Rice", confidence: 0.95, source: "Front Label", detected: true },
        { field: "Net Quantity", value: "5 kg", confidence: 0.97, source: "Front Label", detected: true },
        { field: "MRP", value: "₹280", confidence: 0.96, source: "Front Label", detected: true },
        { field: "Manufacturer", value: "XYZ Foods Pvt. Ltd.", confidence: 0.94, source: "Back Label", detected: true },
        { field: "Manufacturer Address", value: "Plot 12, Industrial Area, Noida, UP", confidence: 0.91, source: "Back Label", detected: true },
        { field: "Country of Origin", value: "Not detected", confidence: 0, source: "", detected: false },
        { field: "Consumer Care", value: "Not detected", confidence: 0, source: "", detected: false },
      ],
      complianceFindings: [
        {
          id: "f1",
          requirement: "Standard unit representation of net quantity",
          status: "FULFILLED",
          evidence: "5 kg",
          legalBasis: "Section 11 — Prohibition of quotation otherwise than in standard units",
          legalBasisSection: "s11",
          confidence: 0.97,
          explanation: "Net quantity '5 kg' uses kilogram — a standard unit under Section 11 and Schedule I of the Act.",
          requires_human_verification: false,
        },
        {
          id: "f2",
          requirement: "Pre-packaged commodity declarations",
          status: "RULE_DEPENDENT",
          evidence: "Partial declarations present",
          legalBasis: "Section 18 — Declarations on pre-packaged commodities",
          legalBasisSection: "s18",
          confidence: 0.82,
          explanation: "Section 18 requires declarations in the manner prescribed by rules. Complete verification requires applicable Legal Metrology (Packaged Commodities) Rules.",
          requires_human_verification: true,
        },
        {
          id: "f3",
          requirement: "Country of origin declaration",
          status: "RULE_DEPENDENT",
          evidence: "Not detected",
          legalBasis: "Section 18 — Declarations on pre-packaged commodities",
          legalBasisSection: "s18",
          confidence: 0.75,
          explanation: "Country-of-origin declaration requirements depend on applicable rules under Section 18. Cannot confirm from Act text alone.",
          requires_human_verification: true,
        },
      ],
      status: "requires_verification",
      inspectorNotes: "DEMO DATA — Illustrative inspection record.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "demo-2",
      inspectionNumber: "LM-2026-00002",
      date: "2026-09-04",
      time: "14:15",
      location: "Mumbai, Dadar West",
      inspectorId: "u1",
      inspectorName: "Rajesh Kumar",
      product: "ABC Packaged Sugar 1kg",
      manufacturer: "ABC Agro Industries",
      imageUrls: [],
      ocrText: "ABC Sugar\nWt: 2.2 lb\nMRP Rs 55\nABC Agro Industries, Pune",
      extractedFields: [
        { field: "Product Name", value: "ABC Sugar", confidence: 0.92, source: "Front Label", detected: true },
        { field: "Net Quantity", value: "2.2 lb", confidence: 0.89, source: "Front Label", detected: true },
        { field: "MRP", value: "₹55", confidence: 0.93, source: "Front Label", detected: true },
        { field: "Manufacturer", value: "ABC Agro Industries", confidence: 0.9, source: "Back Label", detected: true },
        { field: "Manufacturer Address", value: "Pune", confidence: 0.88, source: "Back Label", detected: true },
        { field: "Country of Origin", value: "Not detected", confidence: 0, source: "", detected: false },
      ],
      complianceFindings: [
        {
          id: "f4",
          requirement: "Standard unit representation of net quantity",
          status: "POTENTIAL_NON_COMPLIANCE",
          evidence: "2.2 lb (pound)",
          legalBasis: "Section 11 — Prohibition of quotation otherwise than in standard units",
          legalBasisSection: "s11",
          confidence: 0.89,
          explanation: "'lb' (pound) is not a standard unit under the Legal Metrology Act, 2009. Section 11 prohibits indication of net quantity in pre-packaged commodities other than standard units. Requires human verification.",
          requires_human_verification: true,
          penaltyInfo: "If confirmed: Section 36 — First offence: fine up to ₹25,000.",
        },
        {
          id: "f5",
          requirement: "Pre-packaged commodity declarations",
          status: "REQUIRES_VERIFICATION",
          evidence: "Partial — manufacturer present, other particulars unclear",
          legalBasis: "Section 18 — Declarations on pre-packaged commodities",
          legalBasisSection: "s18",
          confidence: 0.71,
          explanation: "Section 18 requires prescribed declarations. OCR extracted limited information. Human verification recommended.",
          requires_human_verification: true,
        },
      ],
      status: "potential_non_compliant",
      inspectorNotes: "DEMO DATA — Potential non-standard unit. Requires physical verification.",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
}
