import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { StoryConfig } from "../types";
import { useMap } from "../context/Mapcontext";
import {
  stuntingChartData,
  proteinPieData,
  pengeluaranData,
  type ChartPoint,
  type PieChartData,
  type PengeluaranPoint,
} from "../data/storyData";

interface HeroSectionProps {
  config: StoryConfig;
}

interface SlideData {
  id: string;
  label: string;
  title: string;
  value: string;
  valueNote: string;
  description: string;
  imageSrc: string;
  imageType: "illustration" | "photo";
  layout: "image-right" | "image-left";
  accent: string;
  accentLight: string;
}

const SLIDES: SlideData[] = [
  {
    id: "makanan",
    label: "Pengeluaran Pangan",
    title: "Pengeluaran Per Kapita Per Bulan untuk Makanan",
    value: "Rp 548.000",
    valueNote: "rata-rata NTT, 2023",
    description:
      "Lebih dari separuh pengeluaran rumah tangga di NTT dialokasikan untuk makanan. Ketika daya beli rendah, kualitas gizi yang dikonsumsi ikut terdampak. Kabupaten dengan pengeluaran tertinggi mencapai Rp645.882, sementara yang terendah hanya Rp450.209 per kapita per bulan.",
    imageSrc: "/images/makanan.webp",
    imageType: "illustration",
    layout: "image-right",
    accent: "#7c3aed",
    accentLight: "#ede9fe",
  },
  {
    id: "protein",
    label: "Konsumsi Protein",
    title: "Rata-rata Konsumsi Protein Per Kapita Per Hari",
    value: "54,7 g",
    valueNote: "rata-rata NTT, 2023",
    description:
      "Angka Kecukupan Gizi protein yang dianjurkan adalah 57–62 g per hari. Di NTT, banyak kabupaten belum mencapai standar ini — Rote Ndao hanya 44,73 g/hari. Kekurangan protein kronis pada anak menjadi pemicu utama stunting yang sulit dipulihkan.",
    imageSrc: "/images/protein.webp",
    imageType: "illustration",
    layout: "image-left",
    accent: "#0891b2",
    accentLight: "#e0f2fe",
  },
  {
    id: "stunting",
    label: "Stunting",
    title: "Prevalensi Stunting pada Anak Balita",
    value: "22,4%",
    valueNote: "rata-rata NTT, 2023",
    description:
      "Satu dari empat anak balita di NTT mengalami stunting — kondisi gagal tumbuh akibat kekurangan gizi kronis. Sumba Barat Daya mencatat 39,2%, hampir lima kali lipat dari Lembata (7,9%). Dampaknya meluas ke kemampuan kognitif dan produktivitas jangka panjang.",
    imageSrc: "/images/stunting.webp",
    imageType: "photo",
    layout: "image-right",
    accent: "#dc2626",
    accentLight: "#fee2e2",
  },
];

// 0:hero | 1-3:slides | 4:pie | 5:bar | 6:line | 7:fade
const TOTAL_PHASES = 8;

const DOTS = Array.from({ length: 60 }).map((_, i) => ({
  size: i % 5 === 0 ? 7 : i % 3 === 0 ? 5 : 3,
  color:
    i % 6 === 0
      ? "#7c3aed"
      : i % 6 === 1
        ? "#3b82f6"
        : i % 6 === 2
          ? "#ec4899"
          : i % 6 === 3
            ? "#0891b2"
            : i % 6 === 4
              ? "#f59e0b"
              : "#a5b4fc",
  leftPct: (i * 19.3 + 3) % 93,
  topVh: (i / 60) * TOTAL_PHASES * 100 + (i % 5) * 7,
  baseOpacity: 0.22 + (i % 4) * 0.09,
  parallax: 0.06 + (i % 5) * 0.035,
}));

// ── GANTI fungsi BarChart di HeroSection.tsx dengan ini ───────

function BarChart({
  data,
  progress,
}: {
  data: PengeluaranPoint[];
  progress: number;
}) {
  const total   = data.reduce((s, d) => s + d.value, 0);
  const makanan = data[0];
  const nonMak  = data[1];
  const shareMak = ((makanan.value / total) * 100).toFixed(1);
  const shareNon = ((nonMak.value / total) * 100).toFixed(1);

  // Bar dims
  const BAR_H   = 72;
  const MAX_VAL = makanan.value; // longest bar = 100%

  const bars = [makanan, nonMak];

  return (
    <div style={{ width: "100%", maxWidth: 860, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
          color: "#7c3aed", textTransform: "uppercase", marginBottom: 6,
        }}>
          ● Struktur Pengeluaran · NTT · 2023
        </div>
        <h2 style={{
          fontSize: "clamp(1.1rem,2vw,1.6rem)", fontWeight: 800,
          color: "#0f172a", margin: "0 0 6px", lineHeight: 1.2,
        }}>
          Lebih dari separuh pengeluaran NTT
          <br />untuk kebutuhan makanan
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
          Rata-rata pengeluaran rumah tangga NTT mencapai{" "}
          <strong style={{ color: "#0f172a" }}>
            Rp{total.toLocaleString("id-ID")}
          </strong>
          /kapita/bulan. Porsi makanan yang tinggi ({shareMak}%) mengindikasikan
          daya beli yang masih terbatas untuk kebutuhan non-pangan.
        </p>
      </div>

      {/* Summary chips */}
      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        {[
          { v: `Rp${(total/1000).toFixed(0)}rb`, l: "Total Pengeluaran", c: "#0f172a", bg: "#f8fafc", border: "#e2e8f0" },
          { v: `${shareMak}%`,  l: "Porsi Makanan",     c: "#7c3aed", bg: "#ede9fe", border: "#c4b5fd" },
          { v: `${shareNon}%`,  l: "Porsi Non-Makanan", c: "#0891b2", bg: "#e0f2fe", border: "#7dd3fc" },
        ].map(b => (
          <div key={b.l} style={{
            background: b.bg, borderRadius: 12, padding: "8px 16px",
            border: `1px solid ${b.border}`,
          }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: b.c, lineHeight: 1 }}>
              {b.v}
            </div>
            <div style={{ fontSize: 10, color: b.c, opacity: 0.7, fontWeight: 600,
              letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 3 }}>
              {b.l}
            </div>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {bars.map((d, i) => {
          const pct      = d.value / MAX_VAL;
          const share    = (d.value / total * 100).toFixed(1);
          const barProg  = Math.min(1, Math.max(0, progress * 1.6 - i * 0.3));
          const fadeProg = Math.min(1, barProg * 2.5);

          return (
            <div key={d.short} style={{ opacity: fadeProg }}>
              {/* Label row */}
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "baseline", marginBottom: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: 3,
                    background: d.color, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                    {d.kategori}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: d.color,
                    background: d.color + "15",
                    padding: "2px 8px", borderRadius: 20,
                  }}>
                    {share}%
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#0f172a",
                    fontVariantNumeric: "tabular-nums" }}>
                    Rp{d.value.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Bar track */}
              <div style={{
                position: "relative", height: BAR_H,
                background: d.color + "12",
                borderRadius: 12, overflow: "hidden",
              }}>
                {/* Fill */}
                <div style={{
                  position: "absolute", left: 0, top: 0, bottom: 0,
                  width: `${pct * 100 * barProg}%`,
                  background: `linear-gradient(90deg, ${d.color}cc 0%, ${d.color} 100%)`,
                  borderRadius: 12,
                  boxShadow: `0 4px 20px ${d.color}44`,
                  display: "flex", alignItems: "center",
                  minWidth: barProg > 0.05 ? 8 : 0,
                  transition: "none",
                }}>
                  {/* Shimmer overlay */}
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                    borderRadius: 12,
                  }} />
                </div>

                {/* Inline value label inside bar (appears when bar is wide enough) */}
                {barProg > 0.5 && (
                  <div style={{
                    position: "absolute",
                    left: `${pct * 100 * barProg / 2}%`,
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: 11, fontWeight: 800,
                    color: "rgba(255,255,255,0.9)",
                    letterSpacing: "0.04em",
                    opacity: Math.min(1, (barProg - 0.5) * 4),
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}>
                    {d.short}
                  </div>
                )}

                {/* Per-hari label di ujung kanan bar */}
                {barProg > 0.7 && (
                  <div style={{
                    position: "absolute",
                    right: 12, top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 10, fontWeight: 600,
                    color: d.color + "99",
                    opacity: Math.min(1, (barProg - 0.7) * 5),
                  }}>
                    ≈ Rp{Math.round(d.value / 30).toLocaleString("id-ID")}/hari
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Donut-style proportion visual */}
      {progress > 0.55 && (
        <div style={{
          marginTop: 28,
          opacity: Math.min(1, (progress - 0.55) * 4),
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 18px",
          background: "#fafafa",
          borderRadius: 14,
          border: "1px solid #f1f5f9",
        }}>
          {/* Stacked proportion bar */}
          <div style={{
            flex: 1, height: 20, borderRadius: 20,
            overflow: "hidden", display: "flex",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.08)",
          }}>
            <div style={{
              width: `${shareMak}%`,
              background: "linear-gradient(90deg, #7c3aed, #9333ea)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: "white",
                letterSpacing: "0.04em" }}>{shareMak}%</span>
            </div>
            <div style={{
              flex: 1,
              background: "linear-gradient(90deg, #0891b2, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: "white",
                letterSpacing: "0.04em" }}>{shareNon}%</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { color: "#7c3aed", label: "Makanan" },
              { color: "#0891b2", label: "Non-Makanan" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "#64748b" }}>
                  {l.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insight box */}
      {progress > 0.75 && (
        <div style={{
          marginTop: 16,
          opacity: Math.min(1, (progress - 0.75) * 5),
          padding: "12px 16px",
          background: "linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)",
          borderRadius: 12, border: "1px solid #fed7aa",
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 15, flexShrink: 0 }}>⚠️</span>
          <p style={{ fontSize: 12, color: "#9a3412", margin: 0, lineHeight: 1.65 }}>
            Ketika porsi pengeluaran makanan melebihi 60%,
            rumah tangga memiliki sedikit ruang untuk pengeluaran
            pendidikan, kesehatan, dan sanitasi —
            faktor kunci pencegahan stunting.
          </p>
        </div>
      )}
    </div>
  );
}


// ── SVG LINE CHART ─────────────────────────────────────────────
function SvgChart({
  data,
  width,
  height,
  progress,
}: {
  data: ChartPoint[];
  width: number;
  height: number;
  progress: number;
}) {
  const pad = { top: 28, right: 72, bottom: 44, left: 52 };
  const W = width - pad.left - pad.right;
  const H = height - pad.top - pad.bottom;
  const minY = 12,
    maxY = 50;
  const xS = (i: number) => (i / (data.length - 1)) * W;
  const yS = (v: number) => H - ((v - minY) / (maxY - minY)) * H;
  const line = (key: "ntt" | "nasional") =>
    data
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"}${xS(i).toFixed(1)},${yS(d[key]).toFixed(1)}`,
      )
      .join(" ");
  const area = (key: "ntt" | "nasional") => {
    const pts = data
      .map((d, i) => `${xS(i).toFixed(1)},${yS(d[key]).toFixed(1)}`)
      .join(" L");
    return `M${pts} L${xS(data.length - 1).toFixed(1)},${H} L0,${H} Z`;
  };
  const clipW = W * Math.min(1, progress * 1.15);
  const yTicks = [15, 20, 25, 30, 35, 40, 45];
  const last = data[data.length - 1];
  const targetY = yS(14);
  const showEndLabels = progress > 0.82;
  const showGap = progress > 0.88;

  return (
    <svg
      width={width}
      height={height}
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        <linearGradient id="gNTT2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0.01" />
        </linearGradient>
        <linearGradient id="gNas2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.01" />
        </linearGradient>
        <clipPath id="cDraw2">
          <rect x={0} y={-pad.top} width={clipW} height={height + pad.top} />
        </clipPath>
      </defs>
      <g transform={`translate(${pad.left},${pad.top})`}>
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={0}
              y1={yS(t)}
              x2={W}
              y2={yS(t)}
              stroke={t === 20 ? "#e8e0ff" : "#f1f5f9"}
              strokeWidth={t === 20 ? 1.2 : 1}
            />
            <text
              x={-10}
              y={yS(t) + 4}
              textAnchor="end"
              fontSize={10.5}
              fill="#94a3b8"
              fontWeight={500}
            >
              {t}%
            </text>
          </g>
        ))}
        {targetY >= -8 && (
          <>
            <line
              x1={0}
              y1={targetY}
              x2={W}
              y2={targetY}
              stroke="#0891b2"
              strokeWidth={1.5}
              strokeDasharray="5 4"
              opacity={0.65}
            />
            <rect
              x={W + 4}
              y={targetY - 9}
              width={62}
              height={18}
              rx={4}
              fill="#e0f2fe"
            />
            <text
              x={W + 8}
              y={targetY + 4}
              fontSize={10}
              fill="#0891b2"
              fontWeight={700}
            >
              Target 14%
            </text>
          </>
        )}
        {data.map((d, i) => (
          <text
            key={d.year}
            x={xS(i)}
            y={H + 22}
            textAnchor="middle"
            fontSize={11}
            fill="#94a3b8"
            fontWeight={600}
          >
            {d.year}
          </text>
        ))}
        {data.map((d, i) => (
          <line
            key={d.year + "-v"}
            x1={xS(i)}
            y1={0}
            x2={xS(i)}
            y2={H}
            stroke="#f8fafc"
            strokeWidth={1}
          />
        ))}
        <g clipPath="url(#cDraw2)">
          <path d={area("ntt")} fill="url(#gNTT2)" />
          <path d={area("nasional")} fill="url(#gNas2)" />
        </g>
        <g clipPath="url(#cDraw2)">
          <path
            d={line("ntt")}
            fill="none"
            stroke="#dc2626"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={line("nasional")}
            fill="none"
            stroke="#7c3aed"
            strokeWidth={2.2}
            strokeDasharray="7 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        {data.map((d, i) => {
          const show = Math.min(1, (progress * 1.5 - i / data.length) * 3);
          if (show <= 0) return null;
          return (
            <g key={d.year + "-dot"} opacity={Math.min(1, show)}>
              <circle
                cx={xS(i)}
                cy={yS(d.ntt)}
                r={4.5}
                fill="#fff"
                stroke="#dc2626"
                strokeWidth={2.5}
              />
              <circle
                cx={xS(i)}
                cy={yS(d.nasional)}
                r={3.5}
                fill="#fff"
                stroke="#7c3aed"
                strokeWidth={2}
              />
            </g>
          );
        })}
        {showEndLabels && (
          <>
            <g transform={`translate(${xS(data.length - 1)},${yS(last.ntt)})`}>
              <rect
                x={8}
                y={-12}
                width={48}
                height={20}
                rx={5}
                fill="#dc2626"
                opacity={0.12}
              />
              <text x={12} y={3} fontSize={11} fontWeight={800} fill="#dc2626">
                {last.ntt}%
              </text>
            </g>
            <g
              transform={`translate(${xS(data.length - 1)},${yS(last.nasional)})`}
            >
              <rect
                x={8}
                y={-12}
                width={48}
                height={20}
                rx={5}
                fill="#7c3aed"
                opacity={0.1}
              />
              <text x={12} y={3} fontSize={11} fontWeight={800} fill="#7c3aed">
                {last.nasional}%
              </text>
            </g>
          </>
        )}
        {showGap &&
          (() => {
            const x = xS(data.length - 1) + 52;
            const y1 = yS(last.ntt),
              y2 = yS(last.nasional);
            const mid = (y1 + y2) / 2;
            const op = Math.min(1, (progress - 0.88) * 8);
            return (
              <g opacity={op}>
                <line
                  x1={x}
                  y1={y1}
                  x2={x}
                  y2={y2}
                  stroke="#f97316"
                  strokeWidth={1.5}
                />
                <line
                  x1={x - 4}
                  y1={y1}
                  x2={x + 4}
                  y2={y1}
                  stroke="#f97316"
                  strokeWidth={1.5}
                />
                <line
                  x1={x - 4}
                  y1={y2}
                  x2={x + 4}
                  y2={y2}
                  stroke="#f97316"
                  strokeWidth={1.5}
                />
                <rect
                  x={x + 6}
                  y={mid - 10}
                  width={52}
                  height={20}
                  rx={4}
                  fill="#fff7ed"
                />
                <text
                  x={x + 10}
                  y={mid + 4}
                  fontSize={10}
                  fontWeight={700}
                  fill="#f97316"
                >
                  {(last.ntt - last.nasional).toFixed(1)} poin
                </text>
              </g>
            );
          })()}
        <line x1={0} y1={H} x2={W} y2={H} stroke="#e2e8f0" strokeWidth={1} />
        <line x1={0} y1={0} x2={0} y2={H} stroke="#e2e8f0" strokeWidth={1} />
      </g>
    </svg>
  );
}

// ── PIE CHART 3D ───────────────────────────────────────────────
function PieChart3D({
  data,
  progress,
  size = 320,
}: {
  data: PieChartData[];
  progress: number;
  size?: number;
}) {
  const cx = size / 2,
    cy = size * 0.42;
  const rx = size * 0.42,
    ry = rx * 0.42;
  const depth = size * 0.14;
  const colors = {
    ntt: { top: "#10b981", side: "#059669", highlight: "#34d399" },
    other: { top: "#93c5fd", side: "#3b82f6", highlight: "#bfdbfe" },
  };
  const animPct = Math.min(1, progress * 1.2);
  const nttPct = data[0].pct * animPct;
  const otherPct = data[1].pct * animPct;
  const startAngle = -Math.PI / 2;
  const nttAngle = nttPct * 2 * Math.PI;
  const otherAngle = otherPct * 2 * Math.PI;
  const pt = (angle: number, offsetY = 0) => ({
    x: cx + rx * Math.cos(angle),
    y: cy + ry * Math.sin(angle) + offsetY,
  });
  const arcPath = (startA: number, endA: number, offsetY = 0) => {
    const s = pt(startA, offsetY),
      e = pt(endA, offsetY);
    const largeArc = endA - startA > Math.PI ? 1 : 0;
    return `M ${cx} ${cy + offsetY} L ${s.x} ${s.y} A ${rx} ${ry} 0 ${largeArc} 1 ${e.x} ${e.y} Z`;
  };
  const sidePath = (startA: number, endA: number, color: string) => {
    const paths: React.ReactNode[] = [];
    const steps = 32,
      step = (endA - startA) / steps;
    for (let i = 0; i < steps; i++) {
      const a1 = startA + i * step,
        a2 = startA + (i + 1) * step;
      const midA = (a1 + a2) / 2;
      if (Math.sin(midA) < -0.05) continue;
      const p1 = pt(a1),
        p2 = pt(a2),
        p3 = pt(a2, depth),
        p4 = pt(a1, depth);
      const brightness = 0.6 + 0.4 * Math.max(0, Math.sin(midA));
      paths.push(
        <path
          key={`s${i}`}
          d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} Z`}
          fill={color}
          opacity={brightness}
        />,
      );
    }
    return paths;
  };
  const nttEnd = startAngle + nttAngle;
  const otherEnd = nttEnd + otherAngle;
  const explodeDist =
    progress > 0.5 ? Math.min(1, (progress - 0.5) * 2) * 14 : 0;
  const nttMidAngle = startAngle + nttAngle / 2;
  const explodeX = Math.cos(nttMidAngle) * explodeDist;
  const explodeY = Math.sin(nttMidAngle) * explodeDist * 0.42;
  return (
    <svg
      width={size}
      height={size * 0.85}
      style={{ overflow: "visible", display: "block" }}
    >
      <defs>
        <radialGradient id="pgNTT2" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={colors.ntt.highlight} />
          <stop offset="60%" stopColor={colors.ntt.top} />
          <stop offset="100%" stopColor={colors.ntt.side} />
        </radialGradient>
        <radialGradient id="pgOther2" cx="55%" cy="35%" r="65%">
          <stop offset="0%" stopColor={colors.other.highlight} />
          <stop offset="60%" stopColor={colors.other.top} />
          <stop offset="100%" stopColor="#60a5fa" />
        </radialGradient>
        <filter id="pieShadow2">
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="12"
            floodColor="rgba(0,0,0,0.18)"
          />
        </filter>
      </defs>
      <g filter="url(#pieShadow2)">
        <g>{sidePath(nttEnd, otherEnd, colors.other.side)}</g>
        <g transform={`translate(${explodeX},${explodeY})`}>
          {sidePath(startAngle, nttEnd, colors.ntt.side)}
        </g>
        <path
          d={arcPath(nttEnd, otherEnd)}
          fill="url(#pgOther2)"
          stroke="white"
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <g transform={`translate(${explodeX},${explodeY})`}>
          <path
            d={arcPath(startAngle, nttEnd)}
            fill="url(#pgNTT2)"
            stroke="white"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {progress > 0.6 && (
            <path
              d={arcPath(startAngle + 0.1, nttEnd - 0.1)}
              fill="white"
              opacity={0.08 * Math.min(1, (progress - 0.6) * 3)}
            />
          )}
        </g>
      </g>
    </svg>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function HeroSection({ config }: HeroSectionProps) {
  const { mapReady, setHeroScrolling } = useMap();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [ready, setReady] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartWrapRef = useRef<HTMLDivElement>(null);
  const [chartSize, setChartSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (mapReady) setTimeout(() => setReady(true), 200);
  }, [mapReady]);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const p = Math.max(0, Math.min(1, scrolled / total));
      setScrollProgress(p);
      setScrollY(scrolled);
      setHeroScrolling(p < 0.95);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [setHeroScrolling]);

  useEffect(() => {
    if (!chartWrapRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setChartSize({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(chartWrapRef.current);
    return () => ro.disconnect();
  }, []);

  const phaseSize = 1 / TOTAL_PHASES;
  const currentPhase = Math.min(
    TOTAL_PHASES - 1,
    Math.floor(scrollProgress / phaseSize),
  );
  const phaseProgress = (scrollProgress - currentPhase * phaseSize) / phaseSize;

  const whitePanelOpacity =
    currentPhase < TOTAL_PHASES - 1 ? 1 : 1 - Math.min(1, phaseProgress / 0.8);
  const heroTitleOpacity =
    currentPhase === 0
      ? phaseProgress < 0.5
        ? 1
        : 1 - (phaseProgress - 0.5) / 0.5
      : 0;
  const foodSlide =
    currentPhase === 0
      ? phaseProgress < 0.25
        ? 0
        : Math.min(1, (phaseProgress - 0.25) / 0.45)
      : currentPhase >= 1
        ? 1
        : 0;

  const activeSlideIndex =
    currentPhase >= 1 && currentPhase <= 3 ? currentPhase - 1 : -1;
  const slideContentOpacity =
    activeSlideIndex >= 0
      ? phaseProgress < 0.15
        ? phaseProgress / 0.15
        : phaseProgress > 0.8
          ? 1 - (phaseProgress - 0.8) / 0.2
          : 1
      : 0;

  const phaseOpacity = (phase: number) =>
    currentPhase === phase
      ? phaseProgress < 0.15
        ? phaseProgress / 0.15
        : phaseProgress > 0.85
          ? 1 - (phaseProgress - 0.85) / 0.15
          : 1
      : 0;
  const phaseDraw = (phase: number, speed = 1.4) =>
    currentPhase === phase
      ? Math.min(1, phaseProgress * speed)
      : currentPhase > phase
        ? 1
        : 0;

  // phase 4 = pie, 5 = bar, 6 = line
  const pieOpacity = phaseOpacity(4);
  const pieDraw = phaseDraw(4);
  const barOpacity = phaseOpacity(5);
  const barDraw = phaseDraw(5, 1.2);
  const chartOpacity = phaseOpacity(6);
  const chartDraw = phaseDraw(6, 1.5);

  const activeSlide = activeSlideIndex >= 0 ? SLIDES[activeSlideIndex] : null;
  const nttLast = stuntingChartData[stuntingChartData.length - 1].ntt;
  const nasLast = stuntingChartData[stuntingChartData.length - 1].nasional;
  const nttFirst = stuntingChartData[0].ntt;
  const turun = (nttFirst - nttLast).toFixed(1);
  const gap = (nttLast - nasLast).toFixed(1);
  const nttVal = proteinPieData[0].value;
  const otherVal = proteinPieData[1].value;
  const selisih = (otherVal - nttVal).toFixed(1);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: `${TOTAL_PHASES * 100}vh`,
        zIndex: 5,
      }}
    >
      {/* Dots */}
      {ready &&
        DOTS.map((dot, i) => (
          <div
            key={`d${i}`}
            style={{
              position: "absolute",
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              background: dot.color,
              left: `${dot.leftPct}%`,
              top: `${dot.topVh}vh`,
              opacity: dot.baseOpacity * Math.min(1, whitePanelOpacity + 0.1),
              transform: `translateY(${scrollY * dot.parallax}px)`,
              pointerEvents: "none",
              zIndex: 20,
            }}
          />
        ))}

      {/* Food images */}
      {[
        {
          src: "/images/food1.webp",
          pos: { top: 0, left: 0 },
          tx: -(foodSlide * 340),
          flip: false,
          op: 1,
          size: 260,
        },
        {
          src: "/images/food2.webp",
          pos: { top: 0, right: 0 },
          tx: foodSlide * 340,
          flip: false,
          op: 1,
          size: 260,
        },
        {
          src: "/images/food1.webp",
          pos: { bottom: 0, left: -20 },
          tx: -(foodSlide * 280),
          flip: true,
          op: 0.45,
          size: 200,
        },
        {
          src: "/images/food2.webp",
          pos: { bottom: 0, right: -20 },
          tx: foodSlide * 280,
          flip: false,
          op: 0.45,
          size: 200,
        },
      ].map((img, i) => (
        <div
          key={`fi${i}`}
          style={{
            position: "fixed",
            width: img.size,
            zIndex: 21,
            pointerEvents: "none",
            opacity: ready
              ? Math.max(0, 1 - foodSlide) * whitePanelOpacity * img.op
              : 0,
            transform: `translateX(${img.tx}px)${img.flip ? " scaleX(-1)" : ""}`,
            willChange: "transform,opacity",
            ...(img.pos as React.CSSProperties),
          }}
        >
          <img
            src={img.src}
            alt=""
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      ))}

      {/* Sticky */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          zIndex: 8,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "white",
            opacity: whitePanelOpacity,
            zIndex: 11,
            pointerEvents: whitePanelOpacity < 0.05 ? "none" : "auto",
          }}
        />

        {/* Phase 0: Hero */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: heroTitleOpacity,
            pointerEvents: heroTitleOpacity < 0.05 ? "none" : "auto",
          }}
        >
          <div
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              padding: "0 2rem",
              maxWidth: 820,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 16 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "white",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 50,
                  padding: "10px 24px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                }}
              >
                <img
                  src="/images/stis.webp"
                  alt="Logo STIS"
                  style={{ height: 36, width: "auto", objectFit: "contain" }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    color: "#1e3a5f",
                    textTransform: "uppercase",
                  }}
                >
                  Politeknik Statistika STIS
                </span>
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 24 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              style={{
                fontSize: "clamp(2rem,5vw,3.8rem)",
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: 14,
                background:
                  "linear-gradient(135deg,#1d4ed8 0%,#7c3aed 50%,#db2777 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {config.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "#64748b",
                marginBottom: 18,
                lineHeight: 1.5,
              }}
            >
              {config.subtitle}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 10 }}
              transition={{ duration: 0.7, delay: 1.0 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 20 }}>📍</span>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#1e293b",
                  borderBottom: "2px solid #7c3aed",
                  paddingBottom: 2,
                }}
              >
                {config.region}, Indonesia
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: ready ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              style={{
                fontSize: 14.5,
                color: "#64748b",
                lineHeight: 1.75,
                maxWidth: 540,
                margin: "0 auto 36px",
              }}
            >
              {config.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: ready ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 1.5 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 44,
                  border: "2px solid #7c3aed",
                  borderRadius: 14,
                  display: "flex",
                  justifyContent: "center",
                  paddingTop: 6,
                }}
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: 4,
                    height: 8,
                    background: "#7c3aed",
                    borderRadius: 2,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    style={{
                      width: 12,
                      height: 12,
                      borderRight: "2px solid #7c3aed",
                      borderBottom: "2px solid #7c3aed",
                      transform: "rotate(45deg)",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Phase 1–3: Slides */}
        <AnimatePresence mode="wait">
          {activeSlide && (
            <motion.div
              key={activeSlide.id}
              initial={{
                opacity: 0,
                x: activeSlide.layout === "image-right" ? -60 : 60,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: activeSlide.layout === "image-right" ? 60 : -60,
              }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 16,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                padding: "60px 0 40px",
                opacity: slideContentOpacity,
              }}
            >
              {activeSlide.layout === "image-right" ? (
                <>
                  <div style={{ padding: "0 40px 0 72px" }}>
                    <SlideText slide={activeSlide} />
                  </div>
                  <div style={{ padding: "0 72px 0 20px" }}>
                    <SlideImage slide={activeSlide} />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ padding: "0 20px 0 72px" }}>
                    <SlideImage slide={activeSlide} />
                  </div>
                  <div style={{ padding: "0 72px 0 40px" }}>
                    <SlideText slide={activeSlide} />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {activeSlideIndex >= 0 && (
          <div
            style={{
              position: "absolute",
              right: 24,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "center",
              opacity: slideContentOpacity,
            }}
          >
            {SLIDES.map((s, i) => (
              <div
                key={s.id}
                style={{
                  width: 3,
                  borderRadius: 4,
                  height: i === activeSlideIndex ? 28 : 8,
                  background:
                    i === activeSlideIndex
                      ? (activeSlide?.accent ?? "#7c3aed")
                      : "#cbd5e1",
                  transition: "height 0.35s ease, background 0.35s ease",
                }}
              />
            ))}
          </div>
        )}
        {activeSlide && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id + "-lbl"}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: slideContentOpacity, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                position: "absolute",
                top: 24,
                right: 64,
                zIndex: 20,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: activeSlide.accent,
                background: activeSlide.accentLight,
                padding: "4px 12px",
                borderRadius: 20,
              }}
            >
              {activeSlideIndex + 1} / {SLIDES.length} · {activeSlide.label}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Phase 4: PIE CHART */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 16,
            opacity: pieOpacity,
            pointerEvents: pieOpacity < 0.05 ? "none" : "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "28px 60px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 900,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 14,
                  background: "#ecfdf5",
                  borderRadius: 20,
                  padding: "4px 14px",
                  border: "1px solid #6ee7b720",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#10b981",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#059669",
                  }}
                >
                  Konsumsi Protein · 2023
                </span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(1.3rem,2.5vw,1.85rem)",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 12px",
                  lineHeight: 1.25,
                }}
              >
                NTT kekurangan protein
                <br />
                dibanding provinsi lain
              </h2>
              <p
                style={{
                  fontSize: 13.5,
                  color: "#475569",
                  lineHeight: 1.8,
                  margin: "0 0 24px",
                  maxWidth: 360,
                }}
              >
                Rata-rata konsumsi protein NTT hanya{" "}
                <strong style={{ color: "#10b981" }}>{nttVal} g/hari</strong>,
                sementara rata-rata provinsi lain mencapai{" "}
                <strong style={{ color: "#3b82f6" }}>{otherVal} g/hari</strong>{" "}
                — selisih{" "}
                <strong style={{ color: "#f97316" }}>{selisih} g</strong> per
                hari per kapita.
              </p>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[
                  {
                    label: "NTT",
                    value: `${nttVal} g/hari`,
                    color: "#10b981",
                    bg: "#ecfdf5",
                    border: "#6ee7b7",
                    pct: `${(proteinPieData[0].pct * 100).toFixed(1)}%`,
                  },
                  {
                    label: "Provinsi Lain",
                    value: `${otherVal} g/hari`,
                    color: "#3b82f6",
                    bg: "#eff6ff",
                    border: "#93c5fd",
                    pct: `${(proteinPieData[1].pct * 100).toFixed(1)}%`,
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      background: s.bg,
                      borderRadius: 12,
                      padding: "12px 16px",
                      border: `1px solid ${s.border}44`,
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        background: s.color,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: s.color,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        {s.label}
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: "#0f172a",
                          lineHeight: 1.2,
                        }}
                      >
                        {s.value}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: s.color,
                        opacity: 0.6,
                      }}
                    >
                      {s.pct}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 16,
                  padding: "11px 16px",
                  background: "#fff7ed",
                  borderRadius: 10,
                  border: "1px solid #fed7aa",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                <p
                  style={{
                    fontSize: 12,
                    color: "#9a3412",
                    margin: 0,
                    lineHeight: 1.65,
                  }}
                >
                  AKG protein yang dianjurkan adalah{" "}
                  <strong>57–62 g/hari</strong>. NTT rata-rata masih di bawah
                  angka kecukupan minimum.
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  background: "white",
                  borderRadius: 12,
                  padding: "8px 18px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                  border: "1px solid #f1f5f9",
                }}
              >
                {[
                  { color: "#10b981", label: "NTT", sublabel: `${nttVal}g` },
                  {
                    color: "#93c5fd",
                    label: "Provinsi Lain",
                    sublabel: `${otherVal}g`,
                  },
                ].map((lg) => (
                  <div
                    key={lg.label}
                    style={{ display: "flex", alignItems: "center", gap: 7 }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background: lg.color,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#64748b",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {lg.label}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: "#0f172a",
                        }}
                      >
                        {lg.sublabel}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ position: "relative" }}>
                <PieChart3D
                  data={proteinPieData}
                  progress={pieDraw}
                  size={300}
                />
                {pieDraw > 0.7 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "28%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      opacity: Math.min(1, (pieDraw - 0.7) * 4),
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#64748b",
                        letterSpacing: "0.08em",
                      }}
                    >
                      SELISIH
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        color: "#f97316",
                      }}
                    >
                      {selisih}g
                    </div>
                  </div>
                )}
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  textAlign: "center",
                  margin: 0,
                  maxWidth: 240,
                  lineHeight: 1.6,
                }}
              >
                Proporsi konsumsi protein rata-rata NTT vs rata-rata provinsi
                lain di Indonesia (g/kapita/hari)
              </p>
            </div>
          </div>
        </div>

        {/* Phase 5: BAR CHART */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 16,
            opacity: barOpacity,
            pointerEvents: barOpacity < 0.05 ? "none" : "auto",
            padding: "24px 56px 16px",
            overflowY: "auto",
          }}
        >
          <BarChart data={pengeluaranData} progress={barDraw} />
        </div>

        {/* Phase 6: LINE CHART */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 16,
            opacity: chartOpacity,
            pointerEvents: chartOpacity < 0.05 ? "none" : "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "28px 60px",
          }}
        >
          <div style={{ width: "100%", maxWidth: 980 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 20,
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#dc2626",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#dc2626",
                    }}
                  >
                    Tren Prevalensi Stunting · 2019–2024
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "clamp(1.3rem,2.5vw,1.85rem)",
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: 0,
                    lineHeight: 1.25,
                  }}
                >
                  NTT masih jauh di atas
                  <br />
                  rata-rata nasional
                </h2>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  {
                    v: `↓ ${turun} poin`,
                    l: "Penurunan NTT",
                    c: "#dc2626",
                    bg: "#fee2e2",
                  },
                  {
                    v: `+${gap} poin`,
                    l: "Gap vs Nasional",
                    c: "#7c3aed",
                    bg: "#ede9fe",
                  },
                  {
                    v: "Target 14%",
                    l: "Perpres 72/2021",
                    c: "#0891b2",
                    bg: "#e0f2fe",
                  },
                ].map((b) => (
                  <div
                    key={b.l}
                    style={{
                      background: b.bg,
                      borderRadius: 11,
                      padding: "8px 14px",
                      border: `1px solid ${b.c}20`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: b.c,
                        lineHeight: 1,
                        marginBottom: 2,
                      }}
                    >
                      {b.v}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: b.c,
                        opacity: 0.65,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {b.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 18, marginBottom: 12 }}>
              {[
                { c: "#dc2626", l: "NTT", dash: false },
                { c: "#7c3aed", l: "Nasional", dash: true },
                { c: "#0891b2", l: "Target 14%", dash: true },
              ].map((lg) => (
                <div
                  key={lg.l}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <svg width={22} height={10}>
                    <line
                      x1={0}
                      y1={5}
                      x2={22}
                      y2={5}
                      stroke={lg.c}
                      strokeWidth={lg.dash ? 2 : 2.5}
                      strokeDasharray={lg.dash ? "5 3" : undefined}
                    />
                  </svg>
                  <span
                    style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}
                  >
                    {lg.l}
                  </span>
                </div>
              ))}
            </div>
            <div
              ref={chartWrapRef}
              style={{ width: "100%", height: 248, position: "relative" }}
            >
              {chartSize.w > 0 && (
                <SvgChart
                  data={stuntingChartData}
                  width={chartSize.w}
                  height={chartSize.h}
                  progress={chartDraw}
                />
              )}
            </div>
            <div
              style={{
                marginTop: 16,
                padding: "13px 18px",
                background: "linear-gradient(135deg,#fef9ff 0%,#f0f4ff 100%)",
                borderRadius: 12,
                border: "1px solid #e8e0ff",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
              <p
                style={{
                  fontSize: 12.5,
                  color: "#475569",
                  margin: 0,
                  lineHeight: 1.7,
                }}
              >
                Meski NTT mencatat penurunan konsisten, kesenjangan dengan
                nasional masih{" "}
                <strong style={{ color: "#7c3aed" }}>{gap} poin</strong>. Untuk
                mencapai target 14%, NTT perlu menurunkan prevalensi sebesar{" "}
                <strong style={{ color: "#dc2626" }}>
                  {(nttLast - 14).toFixed(1)} poin lagi
                </strong>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        {currentPhase === 0 && phaseProgress < 0.4 && (
          <div
            style={{
              position: "absolute",
              bottom: 28,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              opacity: Math.max(0, 1 - phaseProgress / 0.4) * 0.45,
            }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: 1,
                height: 32,
                background: "linear-gradient(to bottom,#94a3b8,transparent)",
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function SlideText({ slide }: { slide: SlideData }) {
  return (
    <div>
      <div
        style={{
          display: "inline-block",
          background: slide.accentLight,
          color: slide.accent,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "4px 12px",
          borderRadius: 20,
          marginBottom: 20,
        }}
      >
        {slide.label}
      </div>
      <div
        style={{
          fontSize: "clamp(2.4rem,4.5vw,3.6rem)",
          fontWeight: 800,
          color: slide.accent,
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {slide.value}
      </div>
      <div
        style={{
          fontSize: 12,
          color: slide.accent,
          opacity: 0.65,
          fontWeight: 600,
          letterSpacing: "0.05em",
          marginBottom: 20,
        }}
      >
        {slide.valueNote}
      </div>
      <div
        style={{
          width: 36,
          height: 3,
          borderRadius: 2,
          background: slide.accent,
          marginBottom: 16,
          opacity: 0.5,
        }}
      />
      <h2
        style={{
          fontSize: "clamp(1rem,1.8vw,1.35rem)",
          fontWeight: 700,
          color: "#0f172a",
          lineHeight: 1.4,
          margin: "0 0 14px",
        }}
      >
        {slide.title}
      </h2>
      <p
        style={{
          fontSize: 13.5,
          color: "#475569",
          lineHeight: 1.85,
          margin: 0,
          maxWidth: 400,
        }}
      >
        {slide.description}
      </p>
    </div>
  );
}

function SlideImage({ slide }: { slide: SlideData }) {
  if (slide.imageType === "illustration") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "56vh",
        }}
      >
        <img
          src={slide.imageSrc}
          alt={slide.label}
          style={{
            maxHeight: "52vh",
            maxWidth: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 12px 40px rgba(0,0,0,0.09))",
          }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "56vh",
      }}
    >
      <div
        style={{
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.04),0 24px 64px rgba(0,0,0,0.14)",
          height: "52vh",
          aspectRatio: "4/3",
          position: "relative",
        }}
      >
        <img
          src={slide.imageSrc}
          alt={slide.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background: `linear-gradient(to top,${slide.accent}22,transparent)`,
          }}
        />
      </div>
    </div>
  );
}
