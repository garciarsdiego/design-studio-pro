import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/cockpit/StatusDot";

/* ──────────────────────────────────────────────────────────────────────────
   Design System Reference — Omniforge Studio
   Dark-only cockpit. All values mirror index.css + tailwind.config.ts.
   ────────────────────────────────────────────────────────────────────────── */

type Token = {
  name: string;
  varName: string;
  hsl: string;
  hex: string;
  usage: string;
};

const canvasTokens: Token[] = [
  { name: "Background", varName: "--background", hsl: "0 0% 0%", hex: "#000000", usage: "Pure black canvas" },
  { name: "Foreground", varName: "--foreground", hsl: "0 0% 96%", hex: "#F5F5F5", usage: "Primary text" },
  { name: "Surface Glass", varName: "--surface-glass", hsl: "240 5% 8%", hex: "#131316", usage: "Capsules, modals" },
  { name: "Surface Elevated", varName: "--surface-elevated", hsl: "240 4% 11%", hex: "#1B1B1E", usage: "Popovers, inspectors" },
  { name: "Surface Deep", varName: "--surface-deep", hsl: "240 6% 5%", hex: "#0C0C0E", usage: "Recessed wells" },
];

const stateTokens: Token[] = [
  { name: "Amber (Active)", varName: "--amber", hsl: "18 86% 58%", hex: "#F0723A", usage: "Primary action, selected, active node" },
  { name: "Amber Glow", varName: "--amber-glow", hsl: "18 95% 62%", hex: "#F77A3A", usage: "Glow halo on active surfaces" },
  { name: "Teal (Idle/OK)", varName: "--teal", hsl: "165 68% 63%", hex: "#5DD8B4", usage: "Healthy / completed status" },
  { name: "Danger", varName: "--danger", hsl: "358 75% 59%", hex: "#E04451", usage: "Errors, blocked edges" },
  { name: "Processing", varName: "--processing", hsl: "257 64% 69%", hex: "#A48BE0", usage: "In-flight compile / running" },
];

const textTokens: Token[] = [
  { name: "Text Strong", varName: "--text-strong", hsl: "0 0% 96%", hex: "#F5F5F5", usage: "Headings, primary copy" },
  { name: "Text Mute", varName: "--text-mute", hsl: "0 0% 55%", hex: "#8C8C8C", usage: "Labels, secondary copy" },
  { name: "Text Dim", varName: "--text-dim", hsl: "0 0% 35%", hex: "#595959", usage: "Disabled, ghosted" },
];

/* ────────────────── Section primitives ────────────────── */

const Section = ({
  id,
  label,
  title,
  children,
}: {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="border-t border-white/[0.06] py-16">
    <div className="mb-8 flex items-baseline gap-4">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--text-mute))]">
        {label}
      </span>
      <h2 className="text-2xl font-medium tracking-tight text-foreground">{title}</h2>
    </div>
    {children}
  </section>
);

const Sub = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--text-mute))]">
    {children}
  </h3>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded-sm bg-[hsl(var(--surface-elevated))] px-1.5 py-0.5 font-mono text-[11px] text-[hsl(var(--text-strong))]">
    {children}
  </code>
);

const TokenCard = ({ token }: { token: Token }) => (
  <div className="surface-glass overflow-hidden rounded-xl">
    <div
      className="h-20 w-full border-b border-white/[0.06]"
      style={{ background: `hsl(${token.hsl})` }}
    />
    <div className="space-y-1.5 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">{token.name}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
          {token.hex}
        </span>
      </div>
      <div className="font-mono text-[10px] text-[hsl(var(--text-mute))]">
        {token.varName} · hsl({token.hsl})
      </div>
      <div className="text-xs text-[hsl(var(--text-mute))]">{token.usage}</div>
    </div>
  </div>
);

/* ────────────────── Page ────────────────── */

const DesignSystem = () => {
  useEffect(() => {
    document.title = "Design System — Omniforge Studio";
  }, []);

  return (
    <main className="min-h-screen bg-background bg-grid-dots text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[hsl(var(--text-mute))] transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Cockpit
            </Link>
            <span className="text-[hsl(var(--text-dim))]">/</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-foreground">
              Design System
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
            <StatusDot tone="amber" />
            v1.0 · dark only
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-8">
        {/* Hero */}
        <section className="py-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--amber))]">
            Reference · Cockpit OS
          </div>
          <h1 className="mt-4 max-w-3xl text-5xl font-medium leading-[1.05] tracking-tight">
            A dark-only cockpit system.
            <br />
            <span className="text-[hsl(var(--text-mute))]">
              State-driven palette. No gradients. No serifs.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[hsl(var(--text-mute))]">
            Every visual in Omniforge Studio is built from semantic HSL tokens, two
            typefaces, and a small set of glass surfaces. This page is the canonical
            code reference — copy values verbatim into <Code>index.css</Code> and{" "}
            <Code>tailwind.config.ts</Code>.
          </p>

          <nav className="mt-10 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider">
            {[
              ["foundations", "Foundations"],
              ["color", "Color"],
              ["type", "Typography"],
              ["surfaces", "Surfaces"],
              ["radii", "Radii & Borders"],
              ["effects", "Effects"],
              ["motion", "Motion"],
              ["components", "Components"],
              ["status", "Status & Edges"],
            ].map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[hsl(var(--text-mute))] transition-colors hover:border-white/20 hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </nav>
        </section>

        {/* Foundations */}
        <Section id="foundations" label="01" title="Foundations">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="surface-glass rounded-xl p-6">
              <Sub>Philosophy</Sub>
              <p className="text-sm text-[hsl(var(--text-mute))]">
                Calm operational canvas. Glow only on truly active surfaces. State
                drives color, never decoration.
              </p>
            </div>
            <div className="surface-glass rounded-xl p-6">
              <Sub>Canvas</Sub>
              <p className="text-sm text-[hsl(var(--text-mute))]">
                Pure black <Code>#000000</Code> with a 24px dot grid at 4.5%
                opacity. Use <Code>.bg-grid-dots</Code>.
              </p>
            </div>
            <div className="surface-glass rounded-xl p-6">
              <Sub>Layout</Sub>
              <p className="text-sm text-[hsl(var(--text-mute))]">
                No fixed sidebars. Floating capsule nav (top), fixed chat composer
                (bottom). Modals over 80% black backdrop.
              </p>
            </div>
          </div>
        </Section>

        {/* Color */}
        <Section id="color" label="02" title="Color">
          <Sub>Canvas & surfaces</Sub>
          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {canvasTokens.map((t) => (
              <TokenCard key={t.varName} token={t} />
            ))}
          </div>

          <Sub>State palette</Sub>
          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {stateTokens.map((t) => (
              <TokenCard key={t.varName} token={t} />
            ))}
          </div>

          <Sub>Text scale</Sub>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {textTokens.map((t) => (
              <TokenCard key={t.varName} token={t} />
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section id="type" label="03" title="Typography">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="surface-glass rounded-xl p-8">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
                Inter · UI
              </div>
              <div className="mt-4 space-y-3">
                <div className="text-4xl font-medium tracking-tight">Aa Bb 0123</div>
                <div className="text-2xl">The cockpit observes.</div>
                <div className="text-base text-[hsl(var(--text-mute))]">
                  Body — leading-relaxed, mute by default.
                </div>
                <div className="text-xs text-[hsl(var(--text-dim))]">
                  Caption — text-xs, dim.
                </div>
              </div>
              <div className="mt-6 font-mono text-[11px] text-[hsl(var(--text-mute))]">
                font-feature-settings: "ss01", "cv11"
              </div>
            </div>

            <div className="surface-glass rounded-xl p-8">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
                JetBrains Mono · IDs, logs, labels
              </div>
              <div className="mt-4 space-y-3 font-mono">
                <div className="text-3xl tracking-tight">Aa Bb 0123</div>
                <div className="text-sm uppercase tracking-[0.18em] text-[hsl(var(--text-mute))]">
                  section · label
                </div>
                <div className="text-xs text-[hsl(var(--text-mute))]">
                  wn_reason · 0x4f3a · 12:04:18.221
                </div>
              </div>
              <div className="mt-6 font-mono text-[11px] text-[hsl(var(--text-mute))]">
                font-feature-settings: "ss02", "cv11"
              </div>
            </div>
          </div>

          <div className="mt-8 surface-glass rounded-xl p-6">
            <Sub>Scale</Sub>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-mono text-[11px] md:grid-cols-4">
              {[
                ["text-xs", "12px"],
                ["text-sm", "14px"],
                ["text-base", "16px"],
                ["text-lg", "18px"],
                ["text-xl", "20px"],
                ["text-2xl", "24px"],
                ["text-4xl", "36px"],
                ["text-5xl", "48px"],
              ].map(([cls, px]) => (
                <div key={cls} className="flex justify-between border-b border-white/[0.04] py-1">
                  <span className="text-foreground">{cls}</span>
                  <span className="text-[hsl(var(--text-mute))]">{px}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Surfaces */}
        <Section id="surfaces" label="04" title="Surfaces">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="surface-glass flex h-44 items-center justify-center rounded-xl">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
                  surface-glass
                </span>
              </div>
              <p className="mt-3 text-xs text-[hsl(var(--text-mute))]">
                65% glass · blur 20px · saturate 140%. Default for capsules and cards.
              </p>
            </div>
            <div>
              <div className="surface-glass-strong flex h-44 items-center justify-center rounded-xl">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
                  surface-glass-strong
                </span>
              </div>
              <p className="mt-3 text-xs text-[hsl(var(--text-mute))]">
                88% glass · blur 28px. For floating composers and modals.
              </p>
            </div>
            <div>
              <div className="surface-elevated flex h-44 items-center justify-center rounded-xl">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
                  surface-elevated
                </span>
              </div>
              <p className="mt-3 text-xs text-[hsl(var(--text-mute))]">
                Solid 92% — popovers, inspectors, dropdowns.
              </p>
            </div>
          </div>
        </Section>

        {/* Radii & Borders */}
        <Section id="radii" label="05" title="Radii & Borders">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="surface-glass rounded-xl p-6">
              <Sub>Radius scale</Sub>
              <div className="space-y-3">
                {[
                  ["rounded-sm", "calc(--radius - 4px) · 10px"],
                  ["rounded-md", "calc(--radius - 2px) · 12px"],
                  ["rounded-lg", "var(--radius) · 14px"],
                  ["rounded-xl", "calc(--radius + 4px) · 18px"],
                  ["rounded-2xl", "calc(--radius + 8px) · 22px"],
                  ["rounded-full", "999px · capsules, status dots"],
                ].map(([cls, info]) => (
                  <div key={cls} className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 border border-white/10 bg-[hsl(var(--surface-elevated))] ${cls}`}
                    />
                    <div>
                      <div className="font-mono text-[11px] text-foreground">{cls}</div>
                      <div className="font-mono text-[10px] text-[hsl(var(--text-mute))]">
                        {info}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-glass rounded-xl p-6">
              <Sub>Hairlines</Sub>
              <div className="space-y-4">
                {[
                  ["border-white/[0.04]", "Whisper — internal dividers"],
                  ["border-white/[0.06]", "Default hairline"],
                  ["border-white/[0.08]", "Card edge"],
                  ["border-white/10", "Visible separator"],
                  ["border-white/20", "Hover / focus emphasis"],
                ].map(([cls, info]) => (
                  <div key={cls}>
                    <div
                      className={`h-px w-full ${cls.startsWith("border-") ? cls.replace("border-", "bg-") : ""}`}
                      style={{ background: `hsl(0 0% 100% / ${parseFloat(cls.match(/0\.\d+|\d+/)?.[0] ?? "0.08") <= 1 ? cls.match(/0\.\d+/)?.[0] ?? "0.1" : "0.2"})` }}
                    />
                    <div className="mt-1.5 flex justify-between font-mono text-[10px]">
                      <span className="text-foreground">{cls}</span>
                      <span className="text-[hsl(var(--text-mute))]">{info}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Effects */}
        <Section id="effects" label="06" title="Effects & Glow">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="surface-glass rounded-xl p-6">
              <div className="glow-amber flex h-28 items-center justify-center rounded-xl bg-[hsl(var(--surface-elevated))]">
                <span className="font-mono text-[11px] uppercase tracking-wider text-foreground">
                  glow-amber
                </span>
              </div>
              <p className="mt-3 text-xs text-[hsl(var(--text-mute))]">
                Reserved for active nodes & primary CTAs only.
              </p>
            </div>
            <div className="surface-glass rounded-xl p-6">
              <div className="glow-amber-soft flex h-28 items-center justify-center rounded-xl bg-[hsl(var(--surface-elevated))]">
                <span className="font-mono text-[11px] uppercase tracking-wider text-foreground">
                  glow-amber-soft
                </span>
              </div>
              <p className="mt-3 text-xs text-[hsl(var(--text-mute))]">
                Halo for hover / selected secondary elements.
              </p>
            </div>
            <div className="surface-glass rounded-xl p-6">
              <div className="bg-grid-dots flex h-28 items-center justify-center rounded-xl border border-white/[0.06]">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
                  bg-grid-dots
                </span>
              </div>
              <p className="mt-3 text-xs text-[hsl(var(--text-mute))]">
                24px dot grid. Operational canvas backdrop.
              </p>
            </div>
          </div>
        </Section>

        {/* Motion */}
        <Section id="motion" label="07" title="Motion">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="surface-glass rounded-xl p-6">
              <Sub>Easing</Sub>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between border-b border-white/[0.04] py-1.5">
                  <span>ease-out-expo</span>
                  <span className="text-[hsl(var(--text-mute))]">cubic-bezier(0.16, 1, 0.3, 1)</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.04] py-1.5">
                  <span>status-pulse</span>
                  <span className="text-[hsl(var(--text-mute))]">cubic-bezier(0.4, 0, 0.6, 1)</span>
                </div>
              </div>
            </div>
            <div className="surface-glass rounded-xl p-6">
              <Sub>Durations</Sub>
              <div className="space-y-2 font-mono text-[11px]">
                {[
                  ["fade-in", "240ms"],
                  ["scale-in", "180ms"],
                  ["modal-in", "220ms"],
                  ["backdrop-in", "180ms"],
                  ["node-pulse", "3000ms · loop"],
                  ["status-pulse", "2000ms · loop"],
                  ["flow-dash", "1200ms · loop"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-white/[0.04] py-1.5">
                    <span>{k}</span>
                    <span className="text-[hsl(var(--text-mute))]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 surface-glass rounded-xl p-6">
            <Sub>Live · node-pulse</Sub>
            <div className="flex items-center gap-6">
              <div className="h-20 w-40 animate-node-pulse rounded-xl bg-[hsl(var(--surface-elevated))]" />
              <p className="text-xs text-[hsl(var(--text-mute))]">
                Reserved for the single active node on the canvas. Never apply to
                more than one element at a time.
              </p>
            </div>
          </div>
        </Section>

        {/* Components */}
        <Section id="components" label="08" title="Components">
          <Sub>Buttons</Sub>
          <div className="mb-10 surface-glass flex flex-wrap items-center gap-3 rounded-xl p-6">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
          </div>

          <Sub>Capsule (nav / pill)</Sub>
          <div className="mb-10 surface-glass rounded-xl p-6">
            <div className="surface-glass-strong inline-flex items-center gap-1 rounded-full p-1">
              {["Chat", "Console", "Data"].map((label, i) => (
                <button
                  key={label}
                  className={`rounded-full px-4 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                    i === 1
                      ? "bg-[hsl(var(--amber))] text-[hsl(var(--amber-foreground))]"
                      : "text-[hsl(var(--text-mute))] hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Sub>Mono labels & badges</Sub>
          <div className="mb-10 surface-glass flex flex-wrap items-center gap-3 rounded-xl p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--text-mute))]">
              section · label
            </span>
            <span className="rounded-full border border-[hsl(var(--amber))]/30 bg-[hsl(var(--amber))]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--amber))]">
              active
            </span>
            <span className="rounded-full border border-[hsl(var(--teal))]/30 bg-[hsl(var(--teal))]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--teal))]">
              ok
            </span>
            <span className="rounded-full border border-[hsl(var(--danger))]/30 bg-[hsl(var(--danger))]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--danger))]">
              error
            </span>
            <span className="rounded-full border border-[hsl(var(--processing))]/30 bg-[hsl(var(--processing))]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--processing))]">
              processing
            </span>
          </div>

          <Sub>Glass card</Sub>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="surface-glass rounded-xl p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
                  wn_reason
                </span>
                <StatusDot tone="amber" />
              </div>
              <div className="mt-2 text-base text-foreground">Reasoner</div>
              <div className="mt-1 text-xs text-[hsl(var(--text-mute))]">
                Plans the next tool call from current context.
              </div>
            </div>
            <div className="surface-glass glow-amber rounded-xl p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
                  wn_exec · selected
                </span>
                <StatusDot tone="amber" />
              </div>
              <div className="mt-2 text-base text-foreground">Executor</div>
              <div className="mt-1 text-xs text-[hsl(var(--text-mute))]">
                Glow halo applied — selected / active state.
              </div>
            </div>
          </div>
        </Section>

        {/* Status & edges */}
        <Section id="status" label="09" title="Status & Edges">
          <Sub>Status dots</Sub>
          <div className="mb-10 surface-glass grid grid-cols-2 gap-4 rounded-xl p-6 md:grid-cols-4">
            {(["amber", "teal", "danger", "processing"] as const).map((tone) => (
              <div key={tone} className="flex items-center gap-3">
                <StatusDot tone={tone} />
                <span className="font-mono text-[11px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
                  {tone}
                </span>
              </div>
            ))}
          </div>

          <Sub>Edge states (workflow canvas)</Sub>
          <div className="surface-glass rounded-xl p-6">
            <svg viewBox="0 0 500 160" className="h-44 w-full">
              <defs>
                <marker id="ds-arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--amber))" />
                </marker>
                <marker id="ds-arrow-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--teal))" />
                </marker>
                <marker id="ds-arrow-danger" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--danger))" />
                </marker>
                <marker id="ds-arrow-mute" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="hsl(0 0% 100% / 0.25)" />
                </marker>
              </defs>

              {/* idle */}
              <path d="M 30 30 C 150 30, 250 30, 380 30" fill="none"
                stroke="hsl(0 0% 100% / 0.25)" strokeWidth="1.5"
                vectorEffect="non-scaling-stroke" markerEnd="url(#ds-arrow-mute)" />
              <text x="395" y="34" fontFamily="JetBrains Mono" fontSize="10" fill="hsl(var(--text-mute))">idle</text>

              {/* active */}
              <path d="M 30 70 C 150 70, 250 70, 380 70" fill="none"
                stroke="hsl(var(--amber))" strokeWidth="2"
                strokeDasharray="6 6" vectorEffect="non-scaling-stroke"
                markerEnd="url(#ds-arrow-amber)"
                style={{ animation: "flow-dash 1.2s linear infinite" }} />
              <text x="395" y="74" fontFamily="JetBrains Mono" fontSize="10" fill="hsl(var(--amber))">active</text>

              {/* completed */}
              <path d="M 30 110 C 150 110, 250 110, 380 110" fill="none"
                stroke="hsl(var(--teal))" strokeWidth="1.6"
                vectorEffect="non-scaling-stroke" markerEnd="url(#ds-arrow-teal)" />
              <text x="395" y="114" fontFamily="JetBrains Mono" fontSize="10" fill="hsl(var(--teal))">completed</text>

              {/* error */}
              <path d="M 30 145 C 150 145, 250 145, 380 145" fill="none"
                stroke="hsl(var(--danger))" strokeWidth="1.8"
                vectorEffect="non-scaling-stroke" markerEnd="url(#ds-arrow-danger)" />
              <text x="395" y="149" fontFamily="JetBrains Mono" fontSize="10" fill="hsl(var(--danger))">error</text>
            </svg>
          </div>
        </Section>

        <footer className="border-t border-white/[0.06] py-12">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--text-mute))]">
            <span>Omniforge Studio · Design System Reference</span>
            <Link to="/" className="hover:text-foreground">← back to cockpit</Link>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default DesignSystem;
