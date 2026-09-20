Build a fully functional, polished web application prototype called **LabelSure — AI-Powered Legal Metrology Compliance Ecosystem**.

Do NOT create a superficial UI mockup. Build a realistic, interactive, working full-stack web application with functional frontend, backend/data persistence, document/image upload, OCR processing, compliance-rule evaluation, evidence storage, dashboards, and report generation.

The product follows:

**ENFORCE → PREVENT → VERIFY**

Three stakeholder modes:

1. **ENFORCE** — Government / Legal Metrology Inspector
2. **PREVENT** — Manufacturer / Packer / Importer
3. **VERIFY** — Consumer

The central principle is:

**From Package Image to Explainable Compliance Decision.**

The uploaded reference document is:

**THE LEGAL METROLOGY ACT, 2009 — Act No. 1 of 2010**

Use the actual Act content supplied with this project as the legal source of truth.

DO NOT invent, hallucinate, fabricate, or hard-code fictional legal provisions.

Create a structured legal knowledge base in the backend/database containing the relevant provisions of the uploaded Act, including at minimum:

* Section 1 — Short title, extent and commencement
* Section 2 — Definitions
* Section 3 — Act overriding inconsistent laws
* Section 4 — Metric system
* Section 5 — Base units
* Section 6 — Base unit of numeration
* Section 7 — Standard units
* Section 8 — Standard weight, measure or numeral
* Section 10 — Use of weight or measure for particular purposes
* Section 11 — Prohibition of quotation etc. otherwise than in standard units
* Section 12 — Custom/usage contrary to standard weight, measure or numeration
* Section 15 — Power of inspection, seizure, etc.
* Section 16 — Forfeiture
* Section 17 — Records and registers
* Section 18 — Declarations on pre-packaged commodities
* Section 19 — Registration for importer of weight or measure
* Section 20 — Non-standard weights and measures not to be imported
* Section 22 — Approval of model
* Section 23 — Licence requirements for manufacture/repair/sale of weight or measure
* Section 24 — Verification and stamping
* Sections 25–47 — Relevant offences and penalties
* Section 48 — Compounding
* Section 50 — Appeals
* Section 52 — Central Government rule-making power
* Section 53 — State Government rule-making power
* Section 55 — Exceptions
* Section 57 — Repeal and continuation provisions

The backend must store:

* section_number
* section_title
* legal_text
* source_document
* source_page
* applicable_context
* validation_logic where directly supported
* penalty_information where applicable
* source_type = "Legal Metrology Act, 2009"

IMPORTANT:

The Act says in Section 18 that pre-packaged commodities must bear declarations and particulars "in such manner as may be prescribed."

Therefore, DO NOT falsely claim that the Act itself specifies every detailed package-label declaration.

For any check that requires detailed provisions from the Legal Metrology (Packaged Commodities) Rules or another regulation that is NOT included in the provided source:

display:

**RULE-DEPENDENT**
"Detailed verification requires the applicable Legal Metrology Rules."

Do not invent the missing rule.

This distinction must appear in the UI wherever relevant.

Implement this processing pipeline:

PRODUCT / LABEL IMAGE
↓
IMAGE PREPROCESSING
↓
COMPUTER VISION / LABEL REGION DETECTION
↓
OCR
↓
NLP / CONTEXTUAL INFORMATION EXTRACTION
↓
STRUCTURED PRODUCT INFORMATION
↓
LEGAL METROLOGY RULE ENGINE
↓
COMPLIANCE REASONING
↓
EVIDENCE LINKING
↓
EXPLAINABLE RESULT
↓
ENFORCE / PREVENT / VERIFY

Do NOT make the result a simple keyword search.

For example, if OCR extracts:

"Manufactured by XYZ China Ltd.
Imported by ABC India Pvt. Ltd.
Country of Origin: China"

the system should understand the semantic roles instead of simply searching for "India" and "China".

Use a modern production-style architecture suitable for a hackathon prototype.

Frontend:

* React
* TypeScript
* Tailwind CSS
* shadcn/ui or equivalent polished component system
* Lucide icons
* Responsive desktop-first dashboard
* Mobile responsive consumer interface

Backend:

* Supabase preferred for authentication, PostgreSQL database and file storage
* Server/API functions for analysis and compliance processing
* Persistent database records, NOT local-only dummy state

OCR:

* Use a real OCR implementation such as Tesseract.js or an available OCR API.
* Uploaded label images must actually be processed.
* OCR output must be visible and stored.

AI/NLP:

* Use an available AI API through a secure backend/server function if API credentials are available.
* NEVER expose API keys in frontend code.
* If an external AI key is unavailable, provide a functional deterministic extraction fallback based on OCR text rather than fake AI results.
* Clearly label fallback processing as "OCR-based extraction" rather than pretending an AI model was used.

Legal engine:

* Implement deterministic rule evaluation against the structured Legal Metrology Act knowledge base.
* The legal engine must produce explainable findings with exact section references.

Storage:

* Store uploaded images/evidence in Supabase Storage.
* Store inspections, products, extracted fields, findings, reports and complaints in PostgreSQL.

Create a premium government-tech / compliance-tech interface.

Visual personality:

* Professional
* Trustworthy
* Modern
* Clean
* AI-powered but NOT gimmicky
* Suitable for a Government of India / regulatory technology presentation

Avoid:

* excessive gradients
* childish illustrations
* generic SaaS landing-page appearance
* excessive glassmorphism
* meaningless decorative AI graphics

Use:

* white / off-white surfaces
* deep navy / indigo primary
* restrained saffron/amber accents where appropriate
* green for compliant
* amber for requires verification
* red for potential non-compliance
* excellent typography hierarchy
* cards with subtle borders
* clear spacing
* accessible contrast

Add a persistent top navigation/header containing:

LabelSure logo
Dashboard
Scan
Inspections
Reports
Knowledge Base
Notifications
Profile

### CRITICAL ROLE SEPARATION & SECURITY

ENFORCE, PREVENT, and VERIFY are **three separate authenticated stakeholder workspaces**, NOT tabs or switchable dashboards within the same session.

The stakeholder role must be selected/authenticated from the **Login Page**.

After login, the user must remain inside their authorized workspace:

* **Legal Metrology Inspector → ENFORCE dashboard only**
* **Manufacturer / Packer / Importer → PREVENT dashboard only**
* **Consumer → VERIFY dashboard only**

**DO NOT create a stakeholder switcher in the dashboard.**

Do NOT provide:

* ENFORCE / PREVENT / VERIFY tabs
* a stakeholder dropdown
* a role-switch button
* links to another stakeholder dashboard
* navigation items that allow switching between stakeholder workspaces

A logged-in user must NOT be able to directly access another stakeholder's dashboard.

Implement role-based route protection:

* Inspector → `/enforce/*`
* Manufacturer → `/prevent/*`
* Consumer → `/verify/*`

If a user attempts to access a workspace that does not belong to their authenticated role, deny access and redirect them to their authorized dashboard.

To enter another stakeholder workspace, the user must explicitly:

**LOGOUT → RETURN TO LOGIN PAGE → AUTHENTICATE AS THE OTHER ROLE → ENTER THAT ROLE'S DASHBOARD**

The header should show the currently authenticated role and provide a **Logout** option, but there must be no mechanism for changing roles without logging out.

This separation is important for security, privacy, and stakeholder-specific access control.

The three workspaces may share the same underlying backend, OCR system, legal knowledge base, and compliance engine, but their **frontend routes, permissions, dashboard content, and accessible records must remain role-specific.**


Create functional authentication with role selection:

* Legal Metrology Inspector
* Manufacturer
* Consumer

Create demo accounts/seeded users only for demonstrating the prototype.

Do NOT create fake inspection data pretending it came from real government records.


Create a polished landing page.

Hero:

**LabelSure**
**AI-Powered Legal Metrology Compliance Ecosystem**

Tagline:

**ENFORCE → PREVENT → VERIFY**

Supporting statement:

"From Package Image to Explainable Compliance Decision."

Show three stakeholder cards:

🏛️ ENFORCE
Inspect faster. Preserve evidence. Prioritize compliance risks.

🏭 PREVENT
Detect packaging compliance issues before market entry.

🛒 VERIFY
Understand product declarations and report potential issues.

Primary CTA:
**Start Compliance Check**

Secondary CTA:
**Explore the Ecosystem**

Create a sophisticated government inspector dashboard.

Dashboard cards:

* Inspections Today
* Potential Violations
* Requires Verification
* High-Priority Cases

Show:

* recent inspections
* violation trends
* geographic compliance heatmap
* manufacturer/brand compliance history
* repeat violation patterns
* high-risk cases

IMPORTANT:
Any "risk" must be presented as risk prioritization, NOT legal guilt.

Use language such as:

"Potential Violation"
"Risk Priority"
"Requires Verification"

Never display:
"AI declares this company guilty."

Create a real upload/capture interface.

Options:

* Upload product image
* Upload multiple label images
* Drag and drop
* Camera/capture if browser supports it

Show upload progress.

After upload:

Step 1:
**Image Processing**

Step 2:
**OCR Extraction**

Step 3:
**Information Extraction**

Step 4:
**Legal Compliance Analysis**

Step 5:
**Evidence Linking**

Step 6:
**Final Explainable Result**

Show a processing timeline.

After OCR, display:

PRODUCT INFORMATION

Product Name
Manufacturer
Manufacturer Address
Packer
Importer
Net Quantity
MRP
Country of Origin
Consumer Care
Other Declarations

Each field must have:

* extracted value
* confidence
* source image
* source region where possible

Example:

Manufacturer
ABC Foods Pvt. Ltd.
Confidence 96%

Country of Origin
China
Confidence 93%

If a field cannot be found:

Not detected

Do NOT fabricate values.

Create a requirement-by-requirement compliance table.

Columns:

Requirement
Status
Extracted Evidence
Legal Basis
Confidence
Action

Statuses:

🟢 FULFILLED
🟠 REQUIRES VERIFICATION
🔴 POTENTIAL NON-COMPLIANCE
🔵 RULE-DEPENDENT

IMPORTANT:
Never classify something as legally non-compliant solely because OCR failed.

OCR uncertainty should produce:

**REQUIRES VERIFICATION**

Example:

Net quantity
🟢 Fulfilled
5 kg
Section 11
96%

For requirements where the Act only delegates details to rules:

**RULE-DEPENDENT**
"Detailed package declaration requirements require applicable rules under Section 18."

For a genuinely Act-supported violation, show:

**POTENTIAL NON-COMPLIANCE**

Legal basis:
Section 11 — exact applicable provision

Evidence:
highlighted OCR text / image region

Country of Origin must be handled semantically.

Do NOT simply search for country names.

Distinguish:

Manufacturer
Importer
Country of Origin

If the label says:

"Manufactured by XYZ China Ltd.
Imported by ABC India Pvt. Ltd.
Country of Origin: China"

the system must not confuse the importer address with country of origin.

If no explicit origin declaration is found:

Do NOT automatically claim that the Act itself makes this declaration mandatory.

Instead display:

**RULE-DEPENDENT**
"Country-of-origin declaration requirements depend on the applicable rules/regulatory requirements."

Every finding must be traceable to evidence.

Create an evidence viewer with:

* original image
* zoom
* highlighted relevant region
* OCR text
* extracted field
* legal section
* reasoning
* confidence

Example:

Potential Issue
Missing/uncertain declaration

Evidence:
Back label — Image 02

Confidence:
94%

Legal basis:
Section 18 — declarations on pre-packaged commodities

Then explain:

"Section 18 requires applicable declarations on pre-packaged commodities, with the specific manner and particulars prescribed by rules."

Do not fabricate a more specific rule than the source provides.

Every inspection should create a persistent record containing:

Inspection ID
Date
Time
Location
Inspector
Product
Manufacturer
Images
OCR text
Extracted information
Compliance findings
Evidence
Legal references
Inspector notes
Final status

Generate IDs like:

LM-2026-00001

Location should be captured only with user permission/browser availability.

Create searchable/filterable inspection history.

Filters:

Date
Location
Manufacturer
Product
Status
Risk priority

Clicking an inspection opens its complete evidence-backed record.

Create an interactive India-focused heatmap/dashboard visualization.

Show:

* inspection density
* potential violation concentration
* repeat-risk areas

Do NOT use fabricated real-world government statistics.

If no real dataset exists, label visualization:

**DEMO VISUALIZATION**

and explain:

"Illustrative prototype data — not official government statistics."

Do not present demo numbers as real.

Create manufacturer profiles.

Show:

Products scanned
Compliance history
Potential violations
Repeat patterns
Recent scans

Use demo records only when clearly marked DEMO DATA.

Implement actual database-based history logic.

If the same manufacturer/product has repeated findings, calculate:

Repeat Violation Pattern

But label it:

**Pattern detected from recorded inspections**

not legal guilt.

Create a functional report generator.

Button:

**Generate Inspection Report**

Report must contain:

1. Inspection Details
2. Product Information
3. Extracted Label Information
4. Compliance Checklist
5. Legal Basis
6. Potential Violations
7. Evidence
8. Inspector Remarks
9. Final Status

Statuses:

🟢 Compliant
🟠 Requires Verification
🔴 Potential Non-Compliant

Add:

Edit
Add Remarks
Verify
Finalize
Export

Implement export where feasible:

* PDF
* CSV

If DOCX/XLSX generation is not technically available in the environment, provide CSV/PDF rather than a fake download button.

Create a separate manufacturer workspace.

Hero:

**Check packaging before it reaches the market.**

Workflow:

UPLOAD → ANALYZE → FIX → RE-SCAN → COMPLIANCE READY

Features:

* upload package artwork
* upload label images
* OCR
* compliance analysis
* legal explanation
* issue list
* product/SKU history
* re-scan
* compliance report
* regulatory knowledge updates

Create a realistic editable product/SKU interface.

Example demo product:

XYZ Rice 5 kg

BUT clearly mark demo data.

Do not hard-code fake legal results.

Create a compliance summary.

Instead of inventing a meaningless AI score, calculate the score from actual checks performed.

Example:

Checks performed: 5
Fulfilled: 4
Requires verification: 1
Potential non-compliance: 0

Display:

**4 / 5 checks currently verified**

If a score is shown, clearly explain its formula.

Never imply the score is an official legal certification.

Show:

**AI screening result — not a legal certification.**

Create a simple mobile-friendly consumer experience.

Consumer should be able to:

Scan Product
View Key Information
Verify
Report Issue
Track Complaint

Consumer interface should NOT expose complicated legal language by default.

Show:

Product
MRP
Net Quantity
Manufacturer
Country of Origin
Important declarations

Then:

🟢 No major issue detected

or

🟠 Potential issue detected

When tapped, explain the issue simply.

Create a working complaint flow.

Consumer can report:

* Potential incorrect MRP
* Potential quantity discrepancy
* Missing declaration
* Suspicious label information
* Other packaging concern

Allow:

Product photo
Invoice upload
Description
Purchase/store location

Store complaint in backend.

Generate complaint ID:

LS-C-2026-00001

Convert:

Product image
+
OCR findings
+
detected issue
+
consumer description
+
invoice

into a structured complaint draft.

Show:

Product
Reported Issue
Evidence
AI Finding
Consumer Description
Legal Reference where applicable

The user must be able to:

Edit
Confirm
Submit

Do NOT automatically submit a legal complaint.

The application must NOT claim:

"We are Consumer Court."

Instead say:

"LabelSure helps you identify and document a potential issue. You can use the generated complaint information to approach the appropriate official grievance mechanism."

Provide a clear button:

**Find Official Grievance Channel**

Do not invent an official URL if one is not configured.

Create:

Complaint ID
Submitted date
Issue
Status
Evidence
Current stage

Stages:

Draft
Submitted
Under Review
Action Required
Resolved

Clearly label prototype/demo complaint statuses as DEMO DATA.

Create a dedicated:

**Legal Knowledge Base**

screen.

Display actual Act sections stored in the database.

Search by:

Section number
Keyword
Topic

Example topics:

Pre-packaged commodities
Standard units
Inspection
Declarations
Penalties
Appeals
Weights and measures

Each section should show:

Section 18
Declarations on pre-packaged commodities

Source:
Legal Metrology Act, 2009

Page:
9

Then display the actual source-derived text stored in the database.

Add badges:

ACT SOURCE
RULE-DEPENDENT
DIRECT VALIDATION

Build the architecture so regulations are NOT hard-coded inside the AI prompt.

Database model should support:

regulation_id
source_name
section_number
rule_title
legal_text
applicable_context
validation_logic
effective_from
effective_to
version
source_page
status

The compliance engine queries this knowledge base.

This is critical.

If a regulation changes later, the database/rule layer should be updateable without changing the AI extraction model.

Implement a deterministic compliance evaluation layer.

For each extracted field:

1. Identify the relevant product context.
2. Identify applicable legal provision.
3. Compare extracted information against the provision.
4. Produce a status.
5. Attach evidence.
6. Attach source section.
7. Explain reasoning.
8. Assign confidence.

Every finding must contain:

finding_id
requirement
status
evidence
legal_basis
confidence
explanation
requires_human_verification

Example output:

{
"requirement": "Standard unit representation",
"status": "FULFILLED",
"evidence": "5 kg",
"legal_basis": "Section 11",
"confidence": 0.96
}

For unsupported detailed requirements:

{
"requirement": "Detailed package declaration",
"status": "RULE_DEPENDENT",
"legal_basis": "Section 18",
"explanation": "Section 18 requires prescribed declarations; detailed particulars require applicable rules."
}

Implement actual checks supported by the uploaded Act.

At minimum:

CHECK 1 — Standard units

Section 11 prohibits quotation, price/charge, documents, advertisements, and indication of net quantity otherwise than according to standard units.

Use actual extracted quantities/units.

If an extracted net quantity uses a clearly non-standard unit representation:

flag:

Potential Non-Compliance

Legal Basis:
Section 11

Do not invent conversions or rules not present in the source.

CHECK 2 — Pre-packaged commodity declaration obligation

Section 18 requires pre-packaged commodities to bear prescribed declarations and particulars.

If the system identifies a pre-packaged commodity but cannot determine whether a prescribed declaration is present:

show:

RULE-DEPENDENT / REQUIRES VERIFICATION

Legal Basis:
Section 18

CHECK 3 — Package conformity penalty linkage

Where a package is determined to not conform to declarations applicable under the Act/rules:

link to Section 36.

Display penalty information from Section 36 only when the underlying condition is actually supported.

For example:

Section 36(1):
First offence — fine may extend to ₹25,000
Second offence — fine may extend to ₹50,000
Subsequent offence — fine ₹50,000 to ₹1,00,000 or imprisonment up to one year or both

Section 36(2):
Error in net quantity as prescribed:
fine ₹10,000 to ₹50,000
second/subsequent offence: up to ₹1,00,000 or imprisonment up to one year or both

IMPORTANT:
Do not tell the user that an AI scan itself establishes an offence or penalty.

This is a legal compliance product.

AI must never make the final legal determination.

Every uncertain result should say:

**Requires Human Verification**

Inspector can:

Verify
Reject Finding
Edit
Add Remarks
Finalize

Final legal decision belongs to the authorized human authority.

Create notifications for:

New potential violation
Inspection requiring verification
Repeat pattern detected
Manufacturer re-scan completed
Consumer complaint received
Regulatory knowledge update

Create persistent tables approximately equivalent to:

users
products
inspections
inspection_images
ocr_results
extracted_fields
legal_sections
compliance_rules
compliance_findings
evidence
manufacturers
complaints
reports
notifications

Use foreign keys and timestamps.

Only seed minimal clearly labeled DEMO DATA for UI demonstration.

Do NOT fabricate government statistics.

Use example products such as:

XYZ Premium Rice
ABC Packaged Sugar
Demo Cooking Oil


The legal sections themselves are NOT demo data.

They must come from the supplied Legal Metrology Act, 2009.

The main demonstration should work end-to-end:

1. Login as Inspector
2. Open Scan Product
3. Upload label image
4. Run OCR
5. Show extracted text
6. Extract structured information
7. Run legal compliance engine
8. Show requirement-by-requirement result
9. Click a finding
10. Show highlighted evidence
11. Show exact legal section
12. Show explanation
13. Save inspection
14. Generate report
15. View inspection history

Then demonstrate:

Manufacturer login
→ upload artwork
→ analyze
→ fix
→ re-scan

Then:

Consumer login
→ scan
→ view simple result
→ report issue
→ generate complaint
→ track complaint

Handle:

No image uploaded
Unreadable image
OCR failure
Missing text
Low confidence extraction
Backend unavailable
AI API unavailable
Database failure
Unsupported file type

Never show fake successful results when processing actually failed.

Use:

* loading skeletons
* progress indicators
* toast notifications
* confirmation dialogs
* empty states
* error states
* hover states
* keyboard accessible controls
* responsive layouts

Use subtle animations only where they improve usability.

Create clear breadcrumbs and contextual navigation.

Use charts for:

Inspection volume
Potential violation trends
Compliance status distribution
Manufacturer history
Geographic patterns

Charts must use either actual persisted demo records or clearly marked DEMO DATA.

Never present fabricated statistics as official statistics.

The final result should look like a serious national-level GovTech product rather than a student CRUD application.

The visual hierarchy should immediately communicate:

LABEL IMAGE
↓
AI UNDERSTANDS
↓
LAW CHECKS
↓
EVIDENCE EXPLAINS
↓
STAKEHOLDER ACTS

Add a subtle footer:

"AI-assisted screening. Final legal determination remains with the competent authority."

Also show:

**Legal source: Legal Metrology Act, 2009**

DO NOT prioritize making every feature look complete at the cost of functionality.

Prioritize this working core:

UPLOAD IMAGE
→ OCR
→ STRUCTURED EXTRACTION
→ ACT-BASED LEGAL CHECK
→ EVIDENCE
→ EXPLAINABLE RESULT
→ SAVE TO DATABASE
→ REPORT

Then build the stakeholder dashboards around this shared engine.

Do NOT use fake buttons that do nothing.

Every primary CTA should perform a real action or clearly state that the capability is unavailable.

Do NOT create fake AI analysis results.

Do NOT fabricate legal rules.

Do NOT invent statistics.

Do NOT claim legal certainty.

Build LabelSure as a credible, explainable, evidence-backed Legal Metrology compliance ecosystem.

Final tagline:

**ENFORCE → PREVENT → VERIFY**

Final USP:

**From Package Image to Explainable Compliance Decision.**