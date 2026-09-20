export interface LegalSection {
  id: string;
  section_number: string;
  section_title: string;
  legal_text: string;
  source_document: string;
  source_page: number;
  applicable_context: string[];
  validation_logic?: string;
  penalty_information?: string;
  source_type: string;
  badge: "ACT_SOURCE" | "RULE_DEPENDENT" | "DIRECT_VALIDATION";
  topics: string[];
}

export const LEGAL_SECTIONS: LegalSection[] = [
  {
    id: "s1",
    section_number: "1",
    section_title: "Short title, extent and commencement",
    legal_text:
      "(1) This Act may be called the Legal Metrology Act, 2009.\n(2) It extends to the whole of India.\n(3) It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint; and different dates may be appointed for different provisions of this Act and any reference in any provision to the commencement of this Act shall be construed as a reference to the coming into force of that provision.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 1,
    applicable_context: ["jurisdiction", "commencement"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["general", "commencement"],
  },
  {
    id: "s2",
    section_number: "2",
    section_title: "Definitions",
    legal_text:
      "In this Act, unless the context otherwise requires,—\n(a) 'denomination' means the denomination of a unit of weight, measure or numeral;\n(b) 'dealer' means any person who— (i) carries on directly or otherwise the business of buying, selling, supplying or distributing any weight or measure; or (ii) imports any weight or measure;\n(c) 'Director' means the Director of Legal Metrology appointed under sub-section (1) of section 13;\n(d) 'government weight or measure' means any weight or measure which is owned, maintained or issued by or under the authority of the Central Government;\n(e) 'Inspector' means a Legal Metrology Inspector referred to in section 13;\n(f) 'prescribed' means prescribed by rules made under this Act;\n(g) 'pre-packaged commodity' means a commodity which, without the purchaser being present, is placed in a package of whatever nature, whether sealed or not, so that the product contained therein has a pre-determined quantity;\n(h) 'standard weight or measure' means a weight or measure specified under section 8;\n(i) 'unit of weight or measure' means a unit specified in Schedule I or Schedule II;\n(j) 'verification' means the process of comparing a weight or measure with a standard weight or measure.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 1,
    applicable_context: ["definitions", "terminology"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["definitions", "pre-packaged commodities", "weights and measures"],
  },
  {
    id: "s3",
    section_number: "3",
    section_title: "Act to override inconsistent laws",
    legal_text:
      "The provisions of this Act shall have effect notwithstanding anything inconsistent therewith contained in any enactment other than this Act or in any instrument having effect by virtue of any enactment other than this Act.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 2,
    applicable_context: ["supremacy", "legal hierarchy"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["general", "supremacy"],
  },
  {
    id: "s4",
    section_number: "4",
    section_title: "Metric system to be followed",
    legal_text:
      "The metric system of weights and measures based on the units specified in Schedules I and II shall be used in India for the purposes specified in section 10.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 2,
    applicable_context: ["metric system", "standard units"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["standard units", "metric system", "weights and measures"],
  },
  {
    id: "s5",
    section_number: "5",
    section_title: "Base units of weights and measures",
    legal_text:
      "The base units of weight and measures shall be as follows:— (i) metre, for length; (ii) kilogram, for mass; (iii) second, for time; (iv) ampere, for electric current; (v) kelvin, for thermodynamic temperature; (vi) mole, for amount of substance; (vii) candela, for luminous intensity.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 2,
    applicable_context: ["base units", "SI units"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["standard units", "weights and measures"],
  },
  {
    id: "s6",
    section_number: "6",
    section_title: "Base unit of numeration",
    legal_text:
      "The base unit of numeration shall be the number ONE, with its decimal multiples and sub-multiples.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 2,
    applicable_context: ["numeration", "decimal system"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["standard units", "numeration"],
  },
  {
    id: "s7",
    section_number: "7",
    section_title: "Standard units of weights and measures",
    legal_text:
      "The standard units of weights and measures shall be the units specified in Schedule I and the multiples and sub-multiples thereof specified in Schedule II, and such other units as the Central Government may, by notification in the Official Gazette, specify in that behalf.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 3,
    applicable_context: ["standard units", "multiples", "sub-multiples"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["standard units", "weights and measures"],
  },
  {
    id: "s8",
    section_number: "8",
    section_title: "Standard weight, measure or numeral",
    legal_text:
      "The Central Government may, by notification in the Official Gazette, specify— (a) the denominations of the standards of weight, measure or numeral; (b) the materials of which such standards shall be made; (c) the values to be assigned to such standards; (d) the form, shape and size of such standards; (e) such other particulars as may be considered necessary to define the standards completely.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 3,
    applicable_context: ["standard weights", "measures", "denominations"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["standard units", "weights and measures"],
  },
  {
    id: "s10",
    section_number: "10",
    section_title: "Use of weight or measure for particular purposes",
    legal_text:
      "Every person who— (a) sells, delivers, or causes to be delivered, any commodity by weight or measure; (b) renders service by weight or measure; (c) uses any weight or measure in any transaction for the purpose of determining the weight, measure or number of any commodity or article; (d) uses any weight or measure in any industrial production for the purpose of determining the weight, measure or number; shall use only such weight or measure which conforms to the standards established by or under this Act.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 4,
    applicable_context: ["commercial transactions", "industrial production", "services"],
    validation_logic: "check_standard_unit_usage",
    source_type: "Legal Metrology Act, 2009",
    badge: "DIRECT_VALIDATION",
    topics: ["standard units", "commercial transactions", "weights and measures"],
  },
  {
    id: "s11",
    section_number: "11",
    section_title: "Prohibition of quotation etc. otherwise than in standard units",
    legal_text:
      "No person shall— (a) quote, or make announcement of, whether by word of mouth or otherwise, any price or charge for any goods or services; (b) issue or exhibit any price list, invoice, cash memo or other document; (c) prepare, publish or exhibit any advertisement, poster or other document; (d) indicate the net quantity of a commodity in any pre-packaged commodity;\notherwise than in accordance with the standard units of weight, measure or numeration specified under this Act:\nProvided that the use of a denomination of a weight, measure or numeration not specified in Schedule I or Schedule II shall be permissible if such denomination is declared, by the Central Government, to be acceptable.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 4,
    applicable_context: [
      "quotation",
      "pricing",
      "net quantity",
      "pre-packaged commodities",
      "advertisements",
    ],
    validation_logic: "check_standard_unit_representation",
    penalty_information:
      "Violation may attract penalty under relevant offence sections of the Act.",
    source_type: "Legal Metrology Act, 2009",
    badge: "DIRECT_VALIDATION",
    topics: ["standard units", "pre-packaged commodities", "declarations", "penalties"],
  },
  {
    id: "s12",
    section_number: "12",
    section_title: "Custom or usage contrary to standard weight, measure or numeration",
    legal_text:
      "No custom, usage or practice of using any weight, measure or numeration contrary to the standards established by or under this Act shall be valid or operative in any transaction.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 5,
    applicable_context: ["custom", "usage", "local practices"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["standard units", "general"],
  },
  {
    id: "s15",
    section_number: "15",
    section_title: "Power of inspection, seizure, etc.",
    legal_text:
      "(1) The Director, Controller and Inspector shall have power— (a) to inspect and verify any weight or measure used or intended to be used in any transaction or for industrial production; (b) to seize any weight or measure or other document or article connected with a case under investigation; (c) to enter any premises and inspect, seize or call for any record, register or document.\n(2) For the purpose of exercising the power under sub-section (1), the Director, Controller or Inspector may— (a) enter any premises where any weight or measure is used or sold;\n(b) require the production of any record or document; (c) seal and seize any weight, measure or commodity.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 6,
    applicable_context: ["inspection", "seizure", "enforcement", "inspector powers"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["inspection", "enforcement"],
  },
  {
    id: "s16",
    section_number: "16",
    section_title: "Forfeiture",
    legal_text:
      "Where any person is convicted of an offence under this Act, the court may, in addition to any other punishment, order forfeiture of any weight or measure in relation to which the offence was committed.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 6,
    applicable_context: ["forfeiture", "conviction", "penalty"],
    penalty_information: "Forfeiture of weight or measure used in the offence.",
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["penalties", "enforcement"],
  },
  {
    id: "s17",
    section_number: "17",
    section_title: "Records and registers",
    legal_text:
      "Every manufacturer, repairer and dealer of weights or measures shall maintain such records and registers in such form and manner as may be prescribed.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 7,
    applicable_context: ["records", "registers", "manufacturers", "dealers"],
    source_type: "Legal Metrology Act, 2009",
    badge: "RULE_DEPENDENT" as any,
    topics: ["records", "manufacturers"],
  },
  {
    id: "s18",
    section_number: "18",
    section_title: "Declarations on pre-packaged commodities",
    legal_text:
      "Every pre-packaged commodity shall bear thereon, or on a label securely affixed thereto, such declarations and particulars in such form and in such manner as may be prescribed.\nProvided that the Central Government may, by notification, exempt any commodity or class of commodities from the operation of this section.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 7,
    applicable_context: [
      "pre-packaged commodities",
      "declarations",
      "labels",
      "particulars",
    ],
    validation_logic: "check_pre_package_declarations",
    source_type: "Legal Metrology Act, 2009",
    badge: "RULE_DEPENDENT",
    topics: ["pre-packaged commodities", "declarations", "labels"],
  },
  {
    id: "s19",
    section_number: "19",
    section_title: "Registration for importer of weight or measure",
    legal_text:
      "No person shall import any weight or measure except under and in accordance with a certificate of registration granted by the Director.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 8,
    applicable_context: ["import", "registration", "weights", "measures"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["import", "registration"],
  },
  {
    id: "s20",
    section_number: "20",
    section_title: "Non-standard weights and measures not to be imported",
    legal_text:
      "No person shall import any weight or measure which does not conform to the standards established by or under this Act.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 8,
    applicable_context: ["import", "non-standard", "weights", "measures"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["import", "standard units", "weights and measures"],
  },
  {
    id: "s22",
    section_number: "22",
    section_title: "Approval of model",
    legal_text:
      "(1) No weight or measure shall be manufactured for use in India, or repaired, unless the model of such weight or measure has been approved by the Central Government in such manner as may be prescribed.\n(2) Every application for approval of a model shall be made in such form, contain such particulars, be accompanied by such fee and be disposed of in such manner as may be prescribed.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 9,
    applicable_context: ["model approval", "manufacture", "repair"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["manufacture", "approval"],
  },
  {
    id: "s23",
    section_number: "23",
    section_title: "Licence for manufacture, repair or sale of weight or measure",
    legal_text:
      "No person shall manufacture, repair or sell, or offer, expose or possess for repair or sale, any weight or measure unless he holds a licence granted by the Controller in this behalf:\nProvided that the Central Government may, by notification, specify any weight or measure to which the provisions of this section shall not apply.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 9,
    applicable_context: ["licence", "manufacture", "repair", "sale"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["manufacture", "licence"],
  },
  {
    id: "s24",
    section_number: "24",
    section_title: "Verification and stamping of weights and measures",
    legal_text:
      "(1) All weights and measures intended to be used— (a) in any commercial dealing, or (b) for the purpose of determining the weight, measure or number of any commodity or article in industrial production, shall be verified and stamped in such manner, at such intervals and in such places as may be prescribed.\n(2) No person shall use for any of the purposes mentioned in sub-section (1) any weight or measure which has not been verified and stamped in accordance with the rules made under this Act.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 10,
    applicable_context: ["verification", "stamping", "commercial dealings"],
    source_type: "Legal Metrology Act, 2009",
    badge: "DIRECT_VALIDATION",
    topics: ["verification", "weights and measures", "inspection"],
  },
  {
    id: "s36",
    section_number: "36",
    section_title: "Penalty for use of non-standard or unstamped weight or measure",
    legal_text:
      "(1) Whoever uses, or offers to use, any weight or measure which does not conform to the standards established by or under this Act, or uses any weight or measure which has not been verified in the manner prescribed, shall be punished for the first offence, with fine which may extend to rupees twenty-five thousand and for the second offence, with fine which may extend to rupees fifty thousand and for the subsequent offence, with fine not less than rupees fifty thousand but which may extend to rupees one lakh or with imprisonment for a term which may extend to one year or with both.\n(2) Whoever makes or uses any transaction or falsely represents any goods, or commits fraud in relation to any declared quantity, shall be punished with fine which may extend to rupees ten thousand to fifty thousand, and for second and subsequent offences, with fine up to rupees one lakh or imprisonment up to one year or both.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 17,
    applicable_context: ["penalty", "non-standard weight", "unstamped", "violation"],
    penalty_information:
      "First offence: fine up to ₹25,000. Second offence: fine up to ₹50,000. Subsequent offences: fine ₹50,000–₹1,00,000 or imprisonment up to 1 year or both. Sub-section (2): error in net quantity: fine ₹10,000–₹50,000; subsequent: up to ₹1,00,000 or 1 year imprisonment or both.",
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["penalties", "non-standard weights", "enforcement"],
  },
  {
    id: "s48",
    section_number: "48",
    section_title: "Compounding of offences",
    legal_text:
      "Any offence punishable under this Act (not being an offence punishable with imprisonment only, or with imprisonment and also with fine) may, either before or after the institution of any prosecution, be compounded by such officers of the Government and for such amount as may be prescribed.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 21,
    applicable_context: ["compounding", "offence", "prosecution"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["penalties", "enforcement", "appeals"],
  },
  {
    id: "s50",
    section_number: "50",
    section_title: "Appeals",
    legal_text:
      "Any person aggrieved by an order made by the Controller under this Act may, within such time as may be prescribed, appeal against such order to such authority as may be prescribed.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 22,
    applicable_context: ["appeals", "controller", "aggrieved party"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["appeals", "enforcement"],
  },
  {
    id: "s52",
    section_number: "52",
    section_title: "Power of Central Government to make rules",
    legal_text:
      "The Central Government may, by notification in the Official Gazette, make rules for carrying out the provisions of this Act, and in particular, and without prejudice to the generality of the foregoing power, such rules may provide for all or any of the following matters, namely: standards of weights and measures; the manner of verification and stamping; the form and particulars of declarations on pre-packaged commodities; registration requirements; and such other matters as may be necessary.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 23,
    applicable_context: ["rule-making", "central government", "delegated legislation"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["general", "rule-making", "declarations"],
  },
  {
    id: "s53",
    section_number: "53",
    section_title: "Power of State Government to make rules",
    legal_text:
      "The State Government may, by notification in the Official Gazette, make rules for the purpose of carrying out the provisions of this Act in their respective States, not inconsistent with the rules made by the Central Government.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 24,
    applicable_context: ["state government", "rule-making", "delegated legislation"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["general", "rule-making"],
  },
  {
    id: "s55",
    section_number: "55",
    section_title: "Exceptions",
    legal_text:
      "Nothing in this Act shall apply to— (a) weights and measures used for personal purposes; (b) transactions of a kind notified by the Central Government as exempt; (c) such other weights, measures or transactions as the Central Government may, by notification, specify.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 25,
    applicable_context: ["exceptions", "exemptions", "personal use"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["general", "exceptions"],
  },
  {
    id: "s57",
    section_number: "57",
    section_title: "Repeal and continuation",
    legal_text:
      "(1) The Standards of Weights and Measures Act, 1976, and the Standards of Weights and Measures (Enforcement) Act, 1985, are hereby repealed.\n(2) Notwithstanding such repeal, anything done or any action taken under the repealed Acts shall be deemed to have been done or taken under the corresponding provisions of this Act.",
    source_document: "Legal Metrology Act, 2009",
    source_page: 26,
    applicable_context: ["repeal", "continuation", "transitional provisions"],
    source_type: "Legal Metrology Act, 2009",
    badge: "ACT_SOURCE",
    topics: ["general", "repeal"],
  },
];

export const STANDARD_UNITS = [
  "kg", "kilogram", "kilograms", "g", "gram", "grams", "mg", "milligram",
  "l", "litre", "litres", "liter", "liters", "ml", "millilitre", "milliliter",
  "m", "metre", "meter", "metres", "meters", "cm", "centimetre", "centimeter",
  "mm", "millimetre", "millimeter", "km", "kilometre", "kilometer",
  "nos", "no", "number", "unit", "units", "pcs", "pieces", "pair", "pairs",
];

export const NON_STANDARD_UNITS = [
  "ser", "seer", "maund", "maud", "tola", "lb", "lbs", "pound", "pounds",
  "oz", "ounce", "ounces", "ft", "feet", "foot", "inch", "inches", "yard", "yards",
  "gallon", "gallons", "quart", "quarts", "pint", "pints",
];

export function getSectionById(id: string): LegalSection | undefined {
  return LEGAL_SECTIONS.find((s) => s.id === id);
}

export function getSectionByNumber(num: string): LegalSection | undefined {
  return LEGAL_SECTIONS.find((s) => s.section_number === num);
}

export function searchSections(query: string): LegalSection[] {
  const q = query.toLowerCase();
  return LEGAL_SECTIONS.filter(
    (s) =>
      s.section_number.includes(q) ||
      s.section_title.toLowerCase().includes(q) ||
      s.legal_text.toLowerCase().includes(q) ||
      s.topics.some((t) => t.toLowerCase().includes(q)) ||
      s.applicable_context.some((c) => c.toLowerCase().includes(q))
  );
}
