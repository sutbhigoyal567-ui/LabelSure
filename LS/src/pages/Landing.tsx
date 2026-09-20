import { Link } from "react-router";
import { ShieldCheck, Scale, Package, ShoppingBag, ArrowRight, BookOpen, CheckCircle } from "lucide-react";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f0f2f7] flex flex-col">
      {/* Navbar */}
      <header className="bg-[#1a2744] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} className="text-amber-400" />
            <span className="font-serif font-bold text-lg">LabelSure</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/knowledge-base" className="text-sm text-white/70 hover:text-white transition-colors hidden sm:block">
              Knowledge Base
            </Link>
            <Link
              to="/login"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#1a2744] text-white pt-16 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-300 text-xs font-mono mb-6">
            <Scale size={12} />
            AI-Powered Legal Metrology Compliance Ecosystem
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-tight mb-4">
            Label<span className="text-amber-400">Sure</span>
          </h1>
          <p className="text-2xl font-light text-white/80 mb-3">
            <span className="text-amber-400 font-semibold">ENFORCE</span>
            <span className="mx-2 text-white/40">→</span>
            <span className="text-emerald-400 font-semibold">PREVENT</span>
            <span className="mx-2 text-white/40">→</span>
            <span className="text-violet-300 font-semibold">VERIFY</span>
          </p>
          <p className="text-white/60 text-lg mt-2 mb-8">
            From Package Image to Explainable Compliance Decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-lg transition-colors"
            >
              Start Compliance Check
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/knowledge-base"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/30 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <BookOpen size={16} />
              Explore the Ecosystem
            </Link>
          </div>
        </div>
      </section>

      {/* Stakeholder cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StakeholderCard
            icon={<Scale size={24} className="text-[#1a2744]" />}
            emoji="🏛️"
            role="ENFORCE"
            label="Government Inspector"
            color="border-t-[#1a2744]"
            description="Inspect faster. Preserve evidence. Prioritize compliance risks with an evidence-backed digital workflow."
            features={["Upload label images", "OCR + compliance analysis", "Evidence-linked findings", "Generate inspection reports"]}
            action={{ label: "Inspector Login", to: "/login" }}
          />
          <StakeholderCard
            icon={<Package size={24} className="text-emerald-700" />}
            emoji="🏭"
            role="PREVENT"
            label="Manufacturer / Packer / Importer"
            color="border-t-emerald-700"
            description="Detect packaging compliance issues before market entry. Fix and re-scan before shipment."
            features={["Pre-launch artwork check", "Requirement-by-requirement analysis", "Legal basis explained", "SKU compliance history"]}
            action={{ label: "Manufacturer Login", to: "/login" }}
          />
          <StakeholderCard
            icon={<ShoppingBag size={24} className="text-violet-700" />}
            emoji="🛒"
            role="VERIFY"
            label="Consumer"
            color="border-t-violet-700"
            description="Understand product declarations and report potential packaging issues through an accessible interface."
            features={["Scan product labels", "Understand key declarations", "Report potential issues", "Track complaint status"]}
            action={{ label: "Consumer Login", to: "/login" }}
          />
        </div>
      </section>

      {/* Pipeline */}
      <section className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-2xl font-bold text-[#1a2744] mb-2">Explainable Compliance Pipeline</h2>
          <p className="text-gray-500 text-sm mb-8">Every finding is traceable to OCR evidence and an exact legal section.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Package Image", "Image Processing", "OCR", "Information Extraction", "Legal Rule Engine", "Compliance Reasoning", "Evidence Linking", "Explainable Result"].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-2">
                <span className="text-xs font-mono bg-[#1a2744] text-white px-2.5 py-1 rounded">{step}</span>
                {i < arr.length - 1 && <span className="text-gray-400 text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal source */}
      <section className="bg-[#f8f9fb] border-t border-gray-200 py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-gray-500 bg-gray-100 px-3 py-1.5 rounded border border-gray-200">
            <BookOpen size={12} />
            Legal Source: Legal Metrology Act, 2009 (Act No. 1 of 2010)
          </div>
          <p className="text-xs text-gray-400 mt-3">
            AI-assisted screening only. Final legal determination remains with the competent authority under the Legal Metrology Act, 2009.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StakeholderCard({
  emoji, role, label, color, description, features, action,
}: {
  icon: React.ReactNode;
  emoji: string;
  role: string;
  label: string;
  color: string;
  description: string;
  features: string[];
  action: { label: string; to: string };
}) {
  return (
    <div className={`bg-white border-t-4 ${color} border border-gray-200 rounded-xl p-6 shadow-sm`}>
      <div className="text-3xl mb-3">{emoji}</div>
      <div className="text-xs font-mono font-bold text-gray-400 tracking-widest mb-1">{role}</div>
      <h3 className="font-serif font-bold text-[#1a2744] text-lg mb-2">{label}</h3>
      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>
      <ul className="space-y-1.5 mb-5">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
            <CheckCircle size={12} className="text-green-500 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        to={action.to}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a2744] hover:text-amber-600 transition-colors"
      >
        {action.label}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
