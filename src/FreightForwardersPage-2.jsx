// src/FreightForwardersPage.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function FreightForwardersPage() {
  return (
    <main style={sx.page}>
      <Header />
      <Hero />
      <Section>
        <div style={sx.grid(2, 24)}>
          <Card>
            <h2 style={sx.h2}>The Payment Problem in Freight</h2>
            <ul style={sx.list}>
              <li>Letters of Credit & bank wires cause <b>7–14 day delays</b>.</li>
              <li>Banks take <b>2–5%</b> in combined fees and FX spreads.</li>
              <li>Funds can be released <b>before proof of shipment</b>.</li>
              <li>Paper-heavy workflows drain operations.</li>
            </ul>
          </Card>
          <Card dark>
            <h3 style={{ ...sx.h2, color: "#fff" }}>XLMGuard Escrow — The Fix</h3>
            <ul style={sx.listDark}>
              <li>⚡ Instant, on-chain settlement when docs are uploaded</li>
              <li>💰 ~0.75% platform fee — keep more margin</li>
              <li>🛡️ Document-linked release prevents fraud</li>
              <li>🚚 Built for forwarders: BL, CI, PL, Insurance</li>
            </ul>
            <div style={{ marginTop: 16 }}>
              <Link to="/register?pilot=freight" style={sx.btnLight}>Start Free Pilot</Link>
            </div>
          </Card>
        </div>
      </Section>

      <HowItWorks />
      <Benefits />
      <Calculator />
      <CaseStudy />
      <Trust />
      <FAQ />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}

/* -------------------------- small comps -------------------------- */

function Header() {
  return (
    <header style={sx.header}>
      <div style={sx.headerInner}>
        <Link to="/" style={sx.brand}>
          <div style={sx.brandDot} />
          <span>XLMGuard</span>
        </Link>
        <nav style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <a href="https://escrow.xlmguard.com" style={sx.navLink}>Escrow</a>
          <Link to="/freight-forwarders" style={{ ...sx.navLink, fontWeight: 700 }}>Freight</Link>
          <Link to="/faq" style={sx.navLink}>FAQ</Link>
          <Link to="/contact" style={sx.navLink}>Contact</Link>
        </nav>
        <Link to="/" style={sx.btnGhost}>← Return Home</Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 0' }}>
      <div style={sx.container}>
        <div style={sx.grid(2, 28, 'center')}>
          <div>
            <h1 style={sx.h1}>Secure Freight Payments in Minutes — Not Weeks</h1>
            <p style={sx.lead}>
              Blockchain escrow designed for freight forwarders. Cut costs, reduce risk, and
              release funds instantly once shipment documents are uploaded.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
              <Link to="/register?pilot=freight" style={sx.btnPrimary}>Start Free Pilot</Link>
              <Link to="/contact?subject=Demo%20XLMGuard%20for%20Freight" style={sx.btnOutline}>Request a Demo</Link>
            </div>
            <div style={sx.heroBadges}>
              <Badge>⏱ Instant settlement</Badge>
              <Badge>💵 Fees from 0.75%</Badge>
              <Badge>🛡 Escrow secured</Badge>
            </div>
          </div>
          <Card>
            <div style={sx.statsGrid}>
              <MiniStat label="Avg Settlement Time" value="~10 min" />
              <MiniStat label="Typical Savings" value="60–80%" />
              <MiniStat label="Chargebacks" value="Near-zero" />
              <MiniStat label="Assets" value="XLM • XRP • USDC" />
            </div>
            <div style={sx.noteBox}>
              Payment releases when your <b>Bill of Lading</b>, <b>Invoice</b>, and <b>Insurance</b> are uploaded.
              No bank paperwork.
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { t: "Buyer Deposits Funds", d: "Escrow wallet holds funds securely on-chain." },
    { t: "Forwarder Uploads Shipping Docs", d: "Bill of Lading, Invoice, Packing List, Insurance Certificate." },
    { t: "Seller Gets Paid Instantly", d: "Automatic release once documents are verified." },
  ];
  return (
    <Section id="how" title="How it works">
      <div style={sx.grid(3, 16)}>
        {steps.map((s) => (
          <Card key={s.t}>
            <div style={sx.stepIcon}>✔</div>
            <h3 style={sx.h3}>{s.t}</h3>
            <p style={sx.p}>{s.d}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Benefits() {
  const items = [
    { t: "Instant Settlement", d: "Minutes instead of days or weeks." },
    { t: "Lower Costs", d: "Fees from ~0.75% vs. 3–5% with banks." },
    { t: "Global Ready", d: "Supports XLM, XRP, and USDC stablecoin." },
    { t: "Document-Linked Security", d: "Funds release only after docs are confirmed." },
  ];
  return (
    <Section id="benefits" title="Key benefits for freight forwarders">
      <div style={sx.grid(4, 16)}>
        {items.map((b) => (
          <Card key={b.t}>
            <h4 style={sx.h4}>{b.t}</h4>
            <p style={sx.p}>{b.d}</p>
          </Card>
        ))}
      </div>
    </Section>
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
    <Section id="calculator" title="Compare fees — bank vs. XLMGuard">
      <div style={sx.grid(2, 24)}>
        <Card>
          <p style={sx.p}>Estimate your annual savings by switching settlement of freight payments to blockchain escrow.</p>
          <div style={sx.grid(3, 12)}>
            <NumberField label="Avg shipment value ($)" value={avgValue} setValue={setAvgValue} step={500} min={0} />
            <NumberField label="Shipments / year" value={shipments} setValue={setShipments} step={5} min={0} />
            <NumberField label="Bank fee %" value={bankFeePct} setValue={setBankFeePct} step={0.25} min={0} max={10} />
          </div>
          <div style={sx.grid(3, 12, 'stretch', 'start', 12)}>
            <Metric title="Bank annual fees" value={currency(bankAnnual)} />
            <Metric title="XLMGuard annual fees" value={`${currency(xlmAnnual)} (0.75%)`} />
            <Metric title="Your savings" value={`${currency(savings)} (${savingsPct.toFixed(0)}%)`} highlight />
          </div>
          <div style={{ marginTop: 8, color: '#64748b', fontSize: 13 }}>
            * Estimates only; excludes FX spread and bank paperwork costs (usually increases bank total).
          </div>
        </Card>
        <Card dark>
          <h3 style={{ ...sx.h2, color: '#fff' }}>Ready to keep more margin?</h3>
          <p style={{ ...sx.p, color: '#cbd5e1' }}>Join forwarders running pilot shipments and settling in minutes after BL upload.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <Link to="/register?pilot=freight" style={sx.btnLight}>Start Free Pilot</Link>
            <Link to="/contact?subject=Demo%20XLMGuard%20for%20Freight" style={sx.btnDarkOutline}>Request Demo</Link>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function CaseStudy() {
  return (
    <Section>
      <div style={sx.grid(3, 16)}>
        <Card styleOverride={{ gridColumn: 'span 2' }}>
          <h2 style={sx.h2}>From 10 days to 10 minutes</h2>
          <p style={sx.p}>
            A mid-sized freight forwarder replaced bank LCs with XLMGuard escrow. Settlement now
            occurs within minutes after document upload, eliminating lengthy bank processes and
            reducing total payment costs by over 70%.
          </p>
          <div style={sx.grid(3, 12)}>
            <Metric title="Settlement time" value="10 days → 10 min" />
            <Metric title="Cost reduction" value="~70% lower" />
            <Metric title="Disputes" value="Near-zero" />
          </div>
        </Card>
        <Card dark>
          <h3 style={{ ...sx.h2, color: '#fff' }}>Try a free pilot</h3>
          <p style={{ ...sx.p, color: '#cbd5e1' }}>Run a live shipment with zero platform fees and see the difference.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <Link to="/register?pilot=freight" style={sx.btnLight}>Start Free Pilot</Link>
            <Link to="/contact?subject=Demo%20XLMGuard%20for%20Freight" style={sx.btnDarkOutline}>Request Demo</Link>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Trust() {
  return (
    <div style={{ padding: '8px 0 0' }}>
      <div style={{ ...sx.container, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', color: '#64748b' }}>
        <Token>XLM</Token><Token>XRP</Token><Token>USDC</Token>
        <span style={{ opacity: .5 }}>•</span>
        <span style={{ fontSize: 14 }}>Backed by blockchain escrow</span>
      </div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    { q: "What currencies are supported?", a: "Stellar (XLM), XRP, and USDC stablecoin." },
    { q: "Do we need special software?", a: "No. XLMGuard runs in the browser; you can integrate via API later if desired." },
    { q: "How does document-linked release work?", a: "Funds are released from escrow only after required shipment docs are uploaded and verified." },
    { q: "Can we trial it first?", a: "Yes. Start a free pilot shipment to validate speed, cost, and workflow for your team." },
  ];
  return (
    <Section id="faq" title="Frequently asked questions">
      <div style={sx.grid(2, 16)}>
        {faqs.map((f) => (
          <details key={f.q} style={sx.faq}>
            <summary style={sx.faqSummary}>{f.q}</summary>
            <p style={{ marginTop: 8, color: '#475569' }}>{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function FinalCTA() {
  return (
    <Section>
      <Card dark styleOverride={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ ...sx.h2, color: '#fff' }}>Move freight. Get paid. Faster.</h2>
          <p style={{ ...sx.p, color: '#cbd5e1' }}>Launch a pilot shipment and see how instant escrow changes your cash flow.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/register?pilot=freight" style={sx.btnLight}>Start Free Pilot</Link>
          <Link to="/contact?subject=Demo%20XLMGuard%20for%20Freight" style={sx.btnDarkOutline}>Request Demo</Link>
          <Link to="/" style={sx.btnGhost}>← Return Home</Link>
        </div>
      </Card>
    </Section>
  );
}

function SiteFooter() {
  return (
    <footer style={{ padding: '24px 0 40px' }}>
      <div style={{ ...sx.container, textAlign: 'center', color: '#64748b', fontSize: 14 }}>
        © {new Date().getFullYear()} XLMGuard — Secure blockchain escrow for global trade.
      </div>
    </footer>
  );
}

/* --------------------------- tiny primitives --------------------------- */

function Section({ id, title, children }) {
  return (
    <section id={id} style={{ padding: '28px 0' }}>
      <div style={sx.container}>
        {title && <h2 style={sx.h2}>{title}</h2>}
        {children}
      </div>
    </section>
  );
}

function Card({ children, dark, styleOverride }) {
  return (
    <div
      style={{
        borderRadius: 20,
        boxShadow: '0 8px 24px rgba(0,0,0,.08)',
        border: `1px solid ${dark ? '#0f172a' : '#e2e8f0'}`,
        background: dark ? '#0f172a' : '#fff',
        padding: 20,
        ...styleOverride
      }}
    >
      {children}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: 12 }}>
      <div style={{ color: '#64748b', fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

/** FIXED: numeric input that doesn't snap-to-step while typing */
function NumberField({ label, value, setValue, step = 1, min, max }) {
  const clamp = (n) => {
    if (typeof min === "number" && n < min) return min;
    if (typeof max === "number" && n > max) return max;
    return n;
    };

  return (
    <label>
      <div style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>{label}</div>
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isNaN(n)) {
            setValue(typeof min === "number" ? min : 0);
            return;
          }
          setValue(clamp(n));
        }}
        onBlur={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) {
            const snapped = Math.round(n / step) * step;
            setValue(clamp(snapped));
          }
        }}
        style={sx.input}
      />
    </label>
  );
}

function Metric({ title, value, highlight }) {
  return (
    <div style={{
      border: '1px solid',
      borderColor: highlight ? '#34d399' : '#e2e8f0',
      background: highlight ? '#ecfdf5' : '#f8fafc',
      borderRadius: 16,
      padding: 12
    }}>
      <div style={{ color: '#64748b', fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span style={{
      border: '1px solid #e2e8f0',
      background: '#fff',
      borderRadius: 999,
      padding: '6px 10px',
      fontSize: 13
    }}>{children}</span>
  );
}

function Token({ children }) {
  return (
    <span style={{
      border: '1px solid #e2e8f0',
      background: '#fff',
      color: '#334155',
      borderRadius: 999,
      padding: '6px 10px',
      fontSize: 13,
      fontWeight: 600
    }}>{children}</span>
  );
}

/* ------------------------------ styles ------------------------------ */

const sx = {
  page: { background: '#f1f5f9', color: '#0f172a', minHeight: '100vh' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 16px' },
  header: {
    position: 'sticky', top: 0, zIndex: 50,
    backdropFilter: 'saturate(180%) blur(6px)',
    background: 'rgba(255,255,255,.8)', borderBottom: '1px solid #e2e8f0'
  },
  headerInner: {
    ...this?.container, // harmless no-op; we’ll just inline:
    maxWidth: 1100, margin: '0 auto', padding: '10px 16px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, color: '#0f172a', textDecoration: 'none' },
  brandDot: { width: 28, height: 28, borderRadius: 10, background: '#0f172a' },
  navLink: { color: '#334155', textDecoration: 'none', fontSize: 14 },
  btnPrimary: { background: '#0f172a', color: '#fff', padding: '10px 14px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 },
  btnOutline: { border: '1px solid #cbd5e1', padding: '10px 14px', borderRadius: 12, textDecoration: 'none', color: '#0f172a' },
  btnLight: { background: '#fff', color: '#0f172a', padding: '10px 14px', borderRadius: 12, textDecoration: 'none', fontWeight: 700 },
  btnDarkOutline: { border: '1px solid rgba(255,255,255,.3)', color: '#fff', padding: '10px 14px', borderRadius: 12, textDecoration: 'none' },
  btnGhost: { border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: 12, textDecoration: 'none', color: '#0f172a' },
  h1: { fontSize: 36, lineHeight: 1.15, fontWeight: 800, margin: '0 0 8px' },
  h2: { fontSize: 24, fontWeight: 800, margin: '0 0 12px' },
  h3: { fontSize: 18, fontWeight: 700, margin: '8px 0' },
  h4: { fontSize: 16, fontWeight: 700, margin: '0 0 4px' },
  lead: { color: '#475569', fontSize: 18, maxWidth: 640 },
  p: { color: '#475569', lineHeight: 1.6, margin: 0 },
  list: { margin: 0, paddingLeft: 18, color: '#475569', lineHeight: 1.6 },
  listDark: { margin: 0, paddingLeft: 0, color: '#cbd5e1', lineHeight: 1.6, listStyle: 'none' },
  heroBadges: { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 },
  grid: (cols, gap = 16, align = 'start', vAlign = 'start', mt = 0) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`,
    gap, alignItems: vAlign, justifyItems: align, marginTop: mt
  }),
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 },
  stepIcon: {
    width: 40, height: 40, borderRadius: 12, background: '#0f172a', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
  },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: 10, fontSize: 14 },
  noteBox: { marginTop: 14, padding: 12, border: '1px dashed #cbd5e1', borderRadius: 12, color: '#475569', background: '#f8fafc' },
  faq: { border: '1px solid #e2e8f0', borderRadius: 16, padding: 16, background: '#fff' },
  faqSummary: { cursor: 'pointer', listStyle: 'none', fontWeight: 700 },
};
