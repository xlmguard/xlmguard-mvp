import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  ShieldCheck,
  FileText,
  Zap,
  DollarSign,
  Timer,
  CheckCircle2,
  Globe,
} from "lucide-react";

/**
 * FreightForwardersPage
 * ------------------------------------------------------------
 * A single-file, production-ready landing page tailored to freight forwarders.
 * - TailwindCSS for styling
 * - Lucide icons, Framer Motion for subtle animations
 * - Built-in fee savings calculator
 * - Clear CTAs for pilot/demo
 *
 * Usage:
 *   1) Add a route: <Route path="/freight-forwarders" element={<FreightForwardersPage />} />
 *   2) Ensure Tailwind is configured in your app (or swap classes for your system)
 *   3) Point the CTA hrefs to your actual routes (/register, /contact, /demo, etc.)
 */
export default function FreightForwardersPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <Benefits />
      <Calculator />
      <CaseStudy />
      <TrustSignals />
      <FAQ />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-semibold">
          <div className="h-8 w-8 rounded-xl bg-slate-900" />
          <span>XLMGuard</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#how" className="hover:text-slate-600">How it works</a>
          <a href="#benefits" className="hover:text-slate-600">Benefits</a>
          <a href="#calculator" className="hover:text-slate-600">Calculator</a>
          <a href="#faq" className="hover:text-slate-600">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/contact?subject=Demo%20XLMGuard%20for%20Freight"
            className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-slate-300 hover:bg-white"
          >
            Request Demo
          </a>
          <a
            href="/register?pilot=freight"
            className="inline-flex px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          >
            Start Free Pilot
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-100" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight"
            >
              Secure Freight Payments in Minutes — Not Weeks
            </motion.h1>
            <p className="mt-4 text-lg text-slate-600">
              Blockchain escrow designed for freight forwarders. Cut costs, reduce risk, and
              release funds instantly once shipment documents are uploaded.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/register?pilot=freight"
                className="px-5 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
              >
                Start Free Pilot
              </a>
              <a
                href="/contact?subject=Demo%20XLMGuard%20for%20Freight"
                className="px-5 py-3 rounded-2xl border border-slate-300 hover:bg-white"
              >
                Request a Demo
              </a>
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2"><Timer className="h-4 w-4"/> Instant settlement</div>
              <div className="flex items-center gap-2"><DollarSign className="h-4 w-4"/> Fees from 0.75%</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Escrow secured</div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-3xl shadow-xl bg-white ring-1 ring-slate-200 p-6">
              <div className="grid grid-cols-2 gap-4">
                <MiniStat icon={Timer} label="Avg Settlement Time" value="~10 min" />
                <MiniStat icon={DollarSign} label="Typical Savings" value="60–80%" />
                <MiniStat icon={ShieldCheck} label="Chargebacks" value="Near-zero" />
                <MiniStat icon={Globe} label="Assets" value="XLM • XRP • USDC" />
              </div>
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600">
                Payment releases when your <strong>Bill of Lading</strong>, <strong>Invoice</strong>, and
                <strong> Insurance</strong> are uploaded. No bank paperwork.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function ProblemSolution() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="bg-white rounded-3xl p-8 ring-1 ring-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold">The Payment Problem in Freight</h2>
          <ul className="mt-4 space-y-3 text-slate-600">
            <li className="flex gap-3"><span className="mt-1">•</span> Letters of Credit & bank wires cause <strong>7–14 day delays</strong>.</li>
            <li className="flex gap-3"><span className="mt-1">•</span> Banks take <strong>2–5%</strong> in combined fees & FX spreads.</li>
            <li className="flex gap-3"><span className="mt-1">•</span> Funds can be released <strong>before proof of shipment</strong>.</li>
            <li className="flex gap-3"><span className="mt-1">•</span> Paper-heavy workflows drain operations.</li>
          </ul>
        </div>
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold">XLMGuard Escrow — The Fix</h3>
          <ul className="mt-4 space-y-3 text-slate-200">
            <li className="flex gap-3"><Zap className="h-5 w-5 mt-0.5"/> Instant, on-chain settlement when docs are uploaded</li>
            <li className="flex gap-3"><DollarSign className="h-5 w-5 mt-0.5"/> ~0.75% platform fee — keep more margin</li>
            <li className="flex gap-3"><ShieldCheck className="h-5 w-5 mt-0.5"/> Document-linked release prevents fraud</li>
            <li className="flex gap-3"><Truck className="h-5 w-5 mt-0.5"/> Built for forwarders: BL, CI, PL, Insurance</li>
          </ul>
          <div className="mt-6">
            <a href="#pilot" className="inline-flex px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100">Start Free Pilot</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: ShieldCheck,
      title: "Buyer Deposits Funds",
      desc: "Escrow wallet holds funds securely on-chain.",
    },
    {
      icon: FileText,
      title: "Forwarder Uploads Shipping Docs",
      desc: "Bill of Lading, Invoice, Packing List, Insurance Certificate.",
    },
    {
      icon: CheckCircle2,
      title: "Seller Gets Paid Instantly",
      desc: "Automatic release once documents are verified.",
    },
  ];

  return (
    <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-white rounded-3xl p-6 ring-1 ring-slate-200"
          >
            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-slate-600">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    { icon: Timer, title: "Instant Settlement", desc: "Minutes instead of days or weeks." },
    { icon: DollarSign, title: "Lower Costs", desc: "Fees from ~0.75% vs. 3–5% with banks." },
    { icon: Globe, title: "Global Ready", desc: "Supports XLM, XRP, and USDC stablecoin." },
    { icon: ShieldCheck, title: "Document-Linked Security", desc: "Funds release only after docs are confirmed." },
  ];

  return (
    <section id="benefits" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold tracking-tight">Key benefits for freight forwarders</h2>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-3xl p-6 ring-1 ring-slate-200">
            <Icon className="h-6 w-6 text-slate-900" />
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className="mt-1 text-slate-600 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Calculator() {
  const [avgValue, setAvgValue] = useState(25000);
  const [shipments, setShipments] = useState(120);
  const [bankFeePct, setBankFeePct] = useState(3);
  const xlmGuardPct = 0.75;

  const { bankAnnual, xlmAnnual, savings, savingsPct } = useMemo(() => {
    const bank = (avgValue * (bankFeePct / 100)) * shipments;
    const xlm = (avgValue * (xlmGuardPct / 100)) * shipments;
    const save = Math.max(bank - xlm, 0);
    const pct = bank > 0 ? (save / bank) * 100 : 0;
    return { bankAnnual: bank, xlmAnnual: xlm, savings: save, savingsPct: pct };
  }, [avgValue, shipments, bankFeePct]);

  const currency = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  return (
    <section id="calculator" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-3xl p-8 ring-1 ring-slate-200">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Compare fees — bank vs. XLMGuard</h2>
            <p className="mt-2 text-slate-600">Estimate your annual savings by switching settlement of freight payments to blockchain escrow.</p>

            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              <NumberField label="Avg shipment value ($)" value={avgValue} setValue={setAvgValue} step={500} min={0} />
              <NumberField label="Shipments / year" value={shipments} setValue={setShipments} step={5} min={0} />
              <NumberField label="Bank fee %" value={bankFeePct} setValue={setBankFeePct} step={0.25} min={0} max={10} />
            </div>

            <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
              <MetricCard title="Bank annual fees" value={currency(bankAnnual)} />
              <MetricCard title="XLMGuard annual fees" value={`${currency(xlmAnnual)} (0.75%)`} />
              <MetricCard title="Your savings" value={`${currency(savings)} (${savingsPct.toFixed(0)}%)`} highlight />
            </div>

            <div className="mt-6 text-slate-500 text-sm">* Estimates only; excludes FX spread and bank paperwork costs (usually increases bank total).</div>
          </div>

          <div className="rounded-2xl bg-slate-900 text-white p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Ready to keep more margin?</h3>
              <p className="mt-2 text-slate-200">Join forwarders running pilot shipments and settling in minutes after BL upload.</p>
            </div>
            <div className="mt-6 flex gap-3">
              <a href="/register?pilot=freight" className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100">Start Free Pilot</a>
              <a href="/contact?subject=Demo%20XLMGuard%20for%20Freight" className="px-4 py-2 rounded-xl border border-white/30 hover:bg-white/10">Request Demo</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NumberField({ label, value, setValue, step = 1, min, max }) {
  return (
    <label className="block">
      <span className="text-sm text-slate-600">{label}</span>
      <input
        type="number"
        className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
        value={value}
        onChange={(e) => {
          const v = parseFloat(e.target.value || 0);
          if (Number.isNaN(v)) return;
          if (typeof min === "number" && v < min) return;
          if (typeof max === "number" && v > max) return;
          setValue(Math.round(v / step) * step);
        }}
      />
    </label>
  );
}

function MetricCard({ title, value, highlight }) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
      <div className="text-slate-500">{title}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

function CaseStudy() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-3xl bg-white ring-1 ring-slate-200 p-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold tracking-tight">From 10 days to 10 minutes</h2>
          <p className="mt-2 text-slate-600">
            A mid-sized freight forwarder replaced bank LCs with XLMGuard escrow. Settlement now
            occurs within minutes after document upload, eliminating lengthy bank processes and
            reducing total payment costs by over 70%.
          </p>
          <ul className="mt-4 grid sm:grid-cols-3 gap-4 text-sm">
            <li className="rounded-2xl bg-slate-50 p-4 border border-slate-200"><div className="text-slate-500">Settlement time</div><div className="text-xl font-semibold">10 days → 10 min</div></li>
            <li className="rounded-2xl bg-slate-50 p-4 border border-slate-200"><div className="text-slate-500">Cost reduction</div><div className="text-xl font-semibold">~70% lower</div></li>
            <li className="rounded-2xl bg-slate-50 p-4 border border-slate-200"><div className="text-slate-500">Disputes</div><div className="text-xl font-semibold">Near-zero</div></li>
          </ul>
        </div>
        <div className="rounded-2xl bg-slate-900 text-white p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Try a free pilot</h3>
            <p className="mt-2 text-slate-200">Run a live shipment with zero platform fees and see the difference.</p>
          </div>
          <div className="mt-6 flex gap-3">
            <a href="/register?pilot=freight" className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100">Start Free Pilot</a>
            <a href="/contact?subject=Demo%20XLMGuard%20for%20Freight" className="px-4 py-2 rounded-xl border border-white/30 hover:bg-white/10">Request Demo</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSignals() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <TokenBadge label="XLM" />
        <TokenBadge label="XRP" />
        <TokenBadge label="USDC" />
        <span className="text-slate-400">•</span>
        <span className="text-slate-500 text-sm">Backed by blockchain escrow</span>
      </div>
    </section>
  );
}

function TokenBadge({ label }) {
  return (
    <span className="px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium">
      {label}
    </span>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "What currencies are supported?",
      a: "Stellar (XLM), XRP, and USDC stablecoin."
    },
    {
      q: "Do we need special software?",
      a: "No. XLMGuard runs in the browser; you can integrate via API later if desired."
    },
    {
      q: "How does document-linked release work?",
      a: "Funds are released from escrow only after required shipment docs are uploaded and verified."
    },
    {
      q: "Can we trial it first?",
      a: "Yes. Start a free pilot shipment to validate speed, cost, and workflow for your team."
    }
  ];

  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <summary className="cursor-pointer list-none flex items-center justify-between">
              <span className="font-semibold">{f.q}</span>
              <span className="ml-4 text-slate-400 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="pilot" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-3xl bg-slate-900 text-white p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Move freight. Get paid. Faster.</h2>
          <p className="mt-2 text-slate-200">Launch a pilot shipment and see how instant escrow changes your cash flow.</p>
        </div>
        <div className="flex gap-3">
          <a href="/register?pilot=freight" className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-semibold hover:bg-slate-100">Start Free Pilot</a>
          <a href="/contact?subject=Demo%20XLMGuard%20for%20Freight" className="px-5 py-3 rounded-2xl border border-white/30 hover:bg-white/10">Request Demo</a>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} XLMGuard — Secure blockchain escrow for global trade.
      </div>
    </footer>
  );
}
