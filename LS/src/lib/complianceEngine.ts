import type { ExtractedField, ComplianceFinding } from "./store";
import { STANDARD_UNITS, NON_STANDARD_UNITS } from "./legal";

export interface ExtractionResult {
  fields: ExtractedField[];
  ocrText: string;
  processingMethod: "OCR_BASED" | "AI_ASSISTED";
}

// Deterministic extraction from OCR text
export function extractFields(ocrText: string): ExtractedField[] {
  const text = ocrText;
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const fields: ExtractedField[] = [];

  const productName = extractProductName(lines, text);
  fields.push({ field: "Product Name", ...productName });

  const netQty = extractNetQuantity(lines, text);
  fields.push({ field: "Net Quantity", ...netQty });

  const mrp = extractMRP(lines, text);
  fields.push({ field: "MRP", ...mrp });

  const manufacturer = extractManufacturer(lines, text);
  fields.push({ field: "Manufacturer", ...manufacturer });

  const mfgAddress = extractManufacturerAddress(lines, text);
  fields.push({ field: "Manufacturer Address", ...mfgAddress });

  const packer = extractPacker(lines, text);
  fields.push({ field: "Packer", ...packer });

  const importer = extractImporter(lines, text);
  fields.push({ field: "Importer", ...importer });

  const origin = extractCountryOfOrigin(lines, text, importer.value, manufacturer.value);
  fields.push({ field: "Country of Origin", ...origin });

  const consumerCare = extractConsumerCare(lines, text);
  fields.push({ field: "Consumer Care", ...consumerCare });

  const mfgDate = extractDate(lines, text, ["mfg", "manufactured on", "manufacturing date", "manufacture date"]);
  fields.push({ field: "Manufacturing Date", ...mfgDate });

  const expDate = extractDate(lines, text, ["best before", "expiry", "exp", "use by", "best by"]);
  fields.push({ field: "Best Before / Expiry", ...expDate });

  return fields;
}

function notDetected(): Omit<ExtractedField, "field"> {
  return { value: "Not detected", confidence: 0, source: "OCR", detected: false };
}

function detected(value: string, confidence: number): Omit<ExtractedField, "field"> {
  return { value, confidence, source: "OCR Extraction", detected: true };
}

function extractProductName(lines: string[], _text: string): Omit<ExtractedField, "field"> {
  // First non-trivial line is often the product name
  const productKeywords = ["product", "name:", "item:"];
  for (const line of lines) {
    const lower = line.toLowerCase();
    for (const kw of productKeywords) {
      if (lower.startsWith(kw)) {
        const val = line.replace(/^[^:]+:\s*/i, "").trim();
        if (val.length > 2) return detected(val, 0.82);
      }
    }
  }
  // Use first substantive line
  const first = lines[0];
  if (first && first.length > 3 && !/^\d/.test(first)) {
    return detected(first, 0.7);
  }
  return notDetected();
}

function extractNetQuantity(lines: string[], text: string): Omit<ExtractedField, "field"> {
  const patterns = [
    /net\s+(?:qty|quantity|wt|weight|content)[:\s]+([0-9.,]+\s*[a-zA-Z]+)/i,
    /(?:qty|quantity)[:\s]+([0-9.,]+\s*[a-zA-Z]+)/i,
    /(?:wt|weight)[:\s]+([0-9.,]+\s*[a-zA-Z]+)/i,
    /([0-9.,]+\s*(?:kg|g|mg|l|litre|liter|ml|gm|kgs|ltr))\b/i,
    /([0-9.,]+\s*(?:lb|lbs|pound|oz|ounce|seer|maund))\b/i,
  ];
  for (const line of lines) {
    for (const p of patterns) {
      const m = line.match(p);
      if (m && m[1]) return detected(m[1].trim(), 0.88);
    }
  }
  for (const p of patterns) {
    const m = text.match(p);
    if (m && m[1]) return detected(m[1].trim(), 0.78);
  }
  return notDetected();
}

function extractMRP(lines: string[], text: string): Omit<ExtractedField, "field"> {
  const patterns = [
    /m\.?r\.?p\.?\s*[:\-]?\s*(?:rs\.?|₹|inr)?\s*([0-9.,]+)/i,
    /(?:rs\.?|₹|inr)\s*([0-9.,]+)/i,
    /price[:\s]+(?:rs\.?|₹|inr)?\s*([0-9.,]+)/i,
  ];
  for (const line of lines) {
    for (const p of patterns) {
      const m = line.match(p);
      if (m && m[1]) return detected(`₹${m[1].trim()}`, 0.91);
    }
  }
  for (const p of patterns) {
    const m = text.match(p);
    if (m && m[1]) return detected(`₹${m[1].trim()}`, 0.81);
  }
  return notDetected();
}

function extractManufacturer(lines: string[], _text: string): Omit<ExtractedField, "field"> {
  const patterns = [/manufactured\s+by[:\s]+(.+)/i, /manufacturer[:\s]+(.+)/i, /mfr[.:\s]+(.+)/i];
  for (const line of lines) {
    for (const p of patterns) {
      const m = line.match(p);
      if (m && m[1] && m[1].length > 3) return detected(m[1].trim(), 0.87);
    }
  }
  return notDetected();
}

function extractManufacturerAddress(lines: string[], _text: string): Omit<ExtractedField, "field"> {
  const addrKeywords = ["address:", "addr:", "located at", "factory:", "plant:"];
  let foundMfr = false;
  for (let i = 0; i < lines.length; i++) {
    const lower = lines[i].toLowerCase();
    if (/manufactured\s*by|manufacturer/i.test(lower)) {
      foundMfr = true;
      // next line might be address
      if (i + 1 < lines.length && lines[i + 1].length > 5) {
        return detected(lines[i + 1], 0.72);
      }
    }
    for (const kw of addrKeywords) {
      if (lower.startsWith(kw)) {
        const val = lines[i].replace(/^[^:]+:\s*/i, "").trim();
        if (val.length > 3) return detected(val, 0.79);
      }
    }
  }
  if (foundMfr) return notDetected();
  return notDetected();
}

function extractPacker(lines: string[], _text: string): Omit<ExtractedField, "field"> {
  for (const line of lines) {
    const m = line.match(/packed\s+by[:\s]+(.+)/i) || line.match(/packer[:\s]+(.+)/i);
    if (m && m[1] && m[1].length > 3) return detected(m[1].trim(), 0.85);
  }
  return notDetected();
}

function extractImporter(lines: string[], _text: string): Omit<ExtractedField, "field"> {
  for (const line of lines) {
    const m =
      line.match(/imported\s+by[:\s]+(.+)/i) ||
      line.match(/importer[:\s]+(.+)/i) ||
      line.match(/sole\s+importer[:\s]+(.+)/i);
    if (m && m[1] && m[1].length > 3) return detected(m[1].trim(), 0.86);
  }
  return notDetected();
}

function extractCountryOfOrigin(
  lines: string[],
  _text: string,
  importerValue: string,
  manufacturerValue: string
): Omit<ExtractedField, "field"> {
  // Semantic extraction — look for explicit country of origin declaration
  for (const line of lines) {
    const m =
      line.match(/country\s+of\s+origin[:\s]+(.+)/i) ||
      line.match(/origin\s+country[:\s]+(.+)/i) ||
      line.match(/made\s+in[:\s]+(.+)/i) ||
      line.match(/product\s+of[:\s]+(.+)/i);
    if (m && m[1] && m[1].length > 1) {
      // Extract just the country, not the importer name
      const val = m[1].trim().split(/[,\n]/)[0].trim();
      return detected(val, 0.90);
    }
  }
  // Do NOT infer country of origin from manufacturer or importer names
  // That would be semantic conflation the spec explicitly warns against
  void importerValue;
  void manufacturerValue;
  return notDetected();
}

function extractConsumerCare(lines: string[], _text: string): Omit<ExtractedField, "field"> {
  for (const line of lines) {
    const m =
      line.match(/consumer\s+care[:\s]+(.+)/i) ||
      line.match(/helpline[:\s]+(.+)/i) ||
      line.match(/toll\s+free[:\s]+(.+)/i) ||
      line.match(/contact[:\s]+(.+)/i);
    if (m && m[1] && m[1].length > 2) return detected(m[1].trim(), 0.81);
  }
  return notDetected();
}

function extractDate(lines: string[], _text: string, keywords: string[]): Omit<ExtractedField, "field"> {
  for (const line of lines) {
    const lower = line.toLowerCase();
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        const m = line.match(/(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-]\d{2}[\/\-]\d{2}|[A-Z][a-z]+\s+\d{4})/);
        if (m && m[1]) return detected(m[1], 0.84);
        const rest = line.replace(/[^:]+:\s*/i, "").trim();
        if (rest.length > 1) return detected(rest, 0.72);
      }
    }
  }
  return notDetected();
}

// Compliance engine
export function evaluateCompliance(fields: ExtractedField[]): ComplianceFinding[] {
  const findings: ComplianceFinding[] = [];

  // CHECK 1: Standard unit representation (Section 11)
  const netQty = fields.find((f) => f.field === "Net Quantity");
  if (netQty) {
    if (!netQty.detected || !netQty.value || netQty.value === "Not detected") {
      findings.push({
        id: crypto.randomUUID(),
        requirement: "Standard unit representation of net quantity",
        status: "REQUIRES_VERIFICATION",
        evidence: "Net quantity not detected in label",
        legalBasis: "Section 11 — Prohibition of quotation otherwise than in standard units",
        legalBasisSection: "s11",
        confidence: 0.7,
        explanation:
          "Section 11 prohibits indicating net quantity in a pre-packaged commodity other than in standard units. Net quantity was not detected; physical verification required.",
        requires_human_verification: true,
      });
    } else {
      const unitMatch = netQty.value.match(/([a-zA-Z]+)\s*$/);
      const unit = unitMatch ? unitMatch[1].toLowerCase() : "";
      const isStandard = STANDARD_UNITS.includes(unit);
      const isNonStandard = NON_STANDARD_UNITS.includes(unit);

      if (isNonStandard) {
        findings.push({
          id: crypto.randomUUID(),
          requirement: "Standard unit representation of net quantity",
          status: "POTENTIAL_NON_COMPLIANCE",
          evidence: netQty.value,
          legalBasis: "Section 11 — Prohibition of quotation otherwise than in standard units",
          legalBasisSection: "s11",
          confidence: netQty.confidence,
          explanation: `Unit '${unit}' appears to be a non-standard unit. Section 11 of the Legal Metrology Act, 2009 prohibits indicating net quantity otherwise than in standard units specified under the Act. This requires human verification to confirm.`,
          requires_human_verification: true,
          penaltyInfo:
            "If confirmed non-compliant: Section 36 — First offence: fine up to ₹25,000. Second: up to ₹50,000. Subsequent: ₹50,000–₹1,00,000 or imprisonment up to 1 year or both.",
        });
      } else if (isStandard) {
        findings.push({
          id: crypto.randomUUID(),
          requirement: "Standard unit representation of net quantity",
          status: "FULFILLED",
          evidence: netQty.value,
          legalBasis: "Section 11 — Prohibition of quotation otherwise than in standard units",
          legalBasisSection: "s11",
          confidence: netQty.confidence,
          explanation: `Net quantity '${netQty.value}' uses a standard unit recognized under the Legal Metrology Act, 2009 and Schedule I.`,
          requires_human_verification: false,
        });
      } else {
        findings.push({
          id: crypto.randomUUID(),
          requirement: "Standard unit representation of net quantity",
          status: "REQUIRES_VERIFICATION",
          evidence: netQty.value,
          legalBasis: "Section 11 — Prohibition of quotation otherwise than in standard units",
          legalBasisSection: "s11",
          confidence: Math.min(netQty.confidence, 0.75),
          explanation: `Unit representation '${unit || netQty.value}' could not be definitively classified. Section 11 requires standard units. Human verification recommended.`,
          requires_human_verification: true,
        });
      }
    }
  }

  // CHECK 2: Pre-packaged commodity declarations (Section 18)
  const declaredFields = ["Manufacturer", "MRP", "Net Quantity"];
  const missingDecl = declaredFields.filter((f) => {
    const field = fields.find((x) => x.field === f);
    return !field?.detected;
  });

  if (missingDecl.length === 0) {
    findings.push({
      id: crypto.randomUUID(),
      requirement: "Pre-packaged commodity declarations (manufacturer, MRP, net qty)",
      status: "RULE_DEPENDENT",
      evidence: "Manufacturer, MRP, and Net Quantity detected",
      legalBasis: "Section 18 — Declarations on pre-packaged commodities",
      legalBasisSection: "s18",
      confidence: 0.85,
      explanation:
        "Section 18 requires pre-packaged commodities to bear prescribed declarations in the prescribed manner. Core fields detected. Full compliance verification requires the applicable Legal Metrology (Packaged Commodities) Rules which are not part of the Act itself.",
      requires_human_verification: true,
    });
  } else {
    findings.push({
      id: crypto.randomUUID(),
      requirement: "Pre-packaged commodity declarations",
      status: "REQUIRES_VERIFICATION",
      evidence: `Missing or undetected: ${missingDecl.join(", ")}`,
      legalBasis: "Section 18 — Declarations on pre-packaged commodities",
      legalBasisSection: "s18",
      confidence: 0.7,
      explanation: `Section 18 requires prescribed declarations on pre-packaged commodities. The following could not be detected: ${missingDecl.join(", ")}. This may indicate missing declarations or OCR limitation — human verification required.`,
      requires_human_verification: true,
    });
  }

  // CHECK 3: Country of Origin (semantic — RULE DEPENDENT)
  const origin = fields.find((f) => f.field === "Country of Origin");
  const importer = fields.find((f) => f.field === "Importer");
  if (importer?.detected && (!origin?.detected)) {
    findings.push({
      id: crypto.randomUUID(),
      requirement: "Country of origin declaration (imported product)",
      status: "RULE_DEPENDENT",
      evidence: `Importer detected: ${importer.value}. Country of origin: not explicitly declared.`,
      legalBasis: "Section 18 — Declarations on pre-packaged commodities",
      legalBasisSection: "s18",
      confidence: 0.78,
      explanation:
        "An importer is identified on the label. Country-of-origin declaration requirements for imported pre-packaged commodities depend on the applicable Legal Metrology (Packaged Commodities) Rules under Section 18 — not directly specified in the Act itself.",
      requires_human_verification: true,
    });
  } else if (origin?.detected) {
    findings.push({
      id: crypto.randomUUID(),
      requirement: "Country of origin declaration",
      status: "RULE_DEPENDENT",
      evidence: `Country of Origin: ${origin.value}`,
      legalBasis: "Section 18 — Declarations on pre-packaged commodities",
      legalBasisSection: "s18",
      confidence: origin.confidence,
      explanation:
        "Country of origin is declared. Full verification of format/manner of declaration requires applicable Legal Metrology (Packaged Commodities) Rules under Section 18.",
      requires_human_verification: false,
    });
  }

  // CHECK 4: MRP quotation in standard format
  const mrp = fields.find((f) => f.field === "MRP");
  if (mrp?.detected) {
    findings.push({
      id: crypto.randomUUID(),
      requirement: "MRP quotation (price in standard format)",
      status: "RULE_DEPENDENT",
      evidence: mrp.value,
      legalBasis: "Section 11 — Prohibition of quotation otherwise than in standard units",
      legalBasisSection: "s11",
      confidence: mrp.confidence,
      explanation:
        "MRP is present. Section 11(a) prohibits quoting prices other than in standard units. Full MRP compliance (format, inclusion of taxes) requires applicable rules.",
      requires_human_verification: false,
    });
  } else {
    findings.push({
      id: crypto.randomUUID(),
      requirement: "MRP quotation",
      status: "REQUIRES_VERIFICATION",
      evidence: "MRP not detected",
      legalBasis: "Section 11 — Prohibition of quotation otherwise than in standard units",
      legalBasisSection: "s11",
      confidence: 0.65,
      explanation:
        "MRP could not be detected. Section 11 prohibits quoting prices other than in standard units. Requires physical verification.",
      requires_human_verification: true,
    });
  }

  return findings;
}

export function computeComplianceSummary(findings: ComplianceFinding[]) {
  const total = findings.length;
  const fulfilled = findings.filter((f) => f.status === "FULFILLED").length;
  const verified = findings.filter((f) => f.status === "REQUIRES_VERIFICATION").length;
  const nonCompliant = findings.filter((f) => f.status === "POTENTIAL_NON_COMPLIANCE").length;
  const ruleDependent = findings.filter((f) => f.status === "RULE_DEPENDENT").length;

  let overallStatus: "compliant" | "requires_verification" | "potential_non_compliant";
  if (nonCompliant > 0) {
    overallStatus = "potential_non_compliant";
  } else if (verified > 0) {
    overallStatus = "requires_verification";
  } else {
    overallStatus = "compliant";
  }

  return { total, fulfilled, verified, nonCompliant, ruleDependent, overallStatus };
}
