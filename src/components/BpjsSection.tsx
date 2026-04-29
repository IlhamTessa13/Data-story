
import { useEffect, useRef, useState } from "react";

const PIE_DATA = [
  {
    label:
      "Persentase Penduduk yang Memiliki BPJS Kesehatan Penerima Bantuan Iuran (PBI)",
    shortLabel: "PBI",
    value: 66.11,
    color: "#E8834A",
  },
  {
    label: "Persentase Penduduk yang Memiliki BPJS Kesehatan Non-PBI",
    shortLabel: "Non-PBI",
    value: 20.02,
    color: "#2BA7A7",
  },
  { label: "Lainnya", shortLabel: "Lainnya", value: 13.87, color: "#F4CE6A" },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function slicePath(cx: number, cy: number, r: number, a1: number, a2: number) {
  const s = polar(cx, cy, r, a2);
  const e = polar(cx, cy, r, a1);
  return [
    `M ${cx} ${cy}`,
    `L ${s.x} ${s.y}`,
    `A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${e.x} ${e.y}`,
    "Z",
  ].join(" ");
}
function buildSlices() {
  let cur = 0;
  return PIE_DATA.map((d) => {
    const start = cur;
    cur += (d.value / 100) * 360;
    return { ...d, start, end: cur };
  });
}

function DonutChart({
  hovered,
  setHovered,
}: {
  hovered: number | null;
  setHovered: (i: number | null) => void;
}) {
  const slices = buildSlices();
  const cx = 185,
    cy = 185,
    r = 165,
    ir = 74;
  return (
    <svg
      width="100%"
      viewBox="0 0 370 370"
      style={{ overflow: "visible", display: "block", cursor: "pointer" }}
    >
      <circle cx={cx} cy={cy} r={r + 8} fill="rgba(0,0,0,0.04)" />
      {slices.map((s, i) => {
        const isH = hovered === i;
        const mid = (s.start + s.end) / 2;
        const lp = polar(cx, cy, (r + ir) / 2, mid);
        const nudge = isH ? polar(0, 0, 14, mid) : { x: 0, y: 0 };
        return (
          <g
            key={i}
            transform={`translate(${nudge.x},${nudge.y})`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              transition: "transform 0.28s cubic-bezier(.34,1.56,.64,1)",
            }}
          >
            <path
              d={slicePath(cx, cy, isH ? r + 16 : r, s.start, s.end)}
              fill={s.color}
              stroke="white"
              strokeWidth={5}
              style={{
                filter: isH ? `drop-shadow(0 6px 18px ${s.color}99)` : "none",
                transition: "filter 0.2s",
              }}
            />
            <text
              x={lp.x}
              y={lp.y + 4}
              textAnchor="middle"
              fontSize={isH ? 15 : 12}
              fill="white"
              fontFamily="'Bricolage Grotesque',sans-serif"
              fontWeight={800}
              style={{ pointerEvents: "none" }}
            >
              {s.value.toFixed(1)}%
            </text>
          </g>
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r={ir}
        fill="rgba(197,237,234,0.7)"
        style={{ pointerEvents: "none" }}
      />
      <circle
        cx={cx}
        cy={cy}
        r={ir - 6}
        fill="rgba(220,248,244,0.85)"
        style={{ pointerEvents: "none" }}
      />
      {hovered !== null ? (
        <>
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            fontSize={11}
            fill="#1a4a44"
            fontFamily="'Plus Jakarta Sans',sans-serif"
            fontWeight={600}
            style={{ pointerEvents: "none" }}
          >
            {slices[hovered].shortLabel}
          </text>
          <text
            x={cx}
            y={cy + 24}
            textAnchor="middle"
            fontSize={32}
            fill={PIE_DATA[hovered].color}
            fontFamily="'Bricolage Grotesque',sans-serif"
            fontWeight={800}
            style={{ pointerEvents: "none" }}
          >
            {PIE_DATA[hovered].value.toFixed(1)}%
          </text>
        </>
      ) : (
        <>
          <text
            x={cx}
            y={cy - 6}
            textAnchor="middle"
            fontSize={11}
            fill="#2a7a70"
            fontFamily="'Plus Jakarta Sans',sans-serif"
            style={{ pointerEvents: "none" }}
          >
            Total
          </text>
          <text
            x={cx}
            y={cy + 26}
            textAnchor="middle"
            fontSize={26}
            fill="#0C2726"
            fontFamily="'Bricolage Grotesque',sans-serif"
            fontWeight={800}
            style={{ pointerEvents: "none" }}
          >
            100%
          </text>
        </>
      )}
    </svg>
  );
}

export default function BpjsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.05 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        boxSizing: "border-box",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <img
        src="/images/vector13.png"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          pointerEvents: "none",
          zIndex: 1,
          objectFit: "fill",
        }}
      />

      <div
        style={{
          ...reveal(0.04),
          position: "absolute",
          bottom: "10px",
          right: "0%",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <img
          src="/images/mhs1.png"
          alt="Ilustrasi petugas"
          style={{
            height: "clamp(360px,62vh,680px)",
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.10))",
            display: "block",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "1.1fr 0.95fr 0.45fr",
          gap: "clamp(1rem,2.5vw,2.5rem)",
          padding: "clamp(2.5rem,6vh,5rem) clamp(2rem,5vw,5rem)",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(0.7rem,1.4vh,1.1rem)",
          }}
        >
          <div
            style={{
              ...reveal(0.04),
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <span
              style={{
                width: 28,
                height: 2.5,
                background: "#F1BD1E",
                borderRadius: 2,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                color: "#F1BD1E",
              }}
            >
              Jaminan Kesehatan
            </span>
          </div>

          <div style={reveal(0.1)}>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.5rem,2.8vw,2.4rem)",
                color: "#D0312D",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Persentase Penduduk{" "}
              <span style={{ color: "#1e1e1e" }}>Ber-BPJS</span>
            </h2>
          </div>

          <div
            style={{
              ...reveal(0.17),
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: 14,
              padding: "clamp(0.7rem,1.5vh,1.1rem)",
            }}
          >
            <p
              style={{
                fontSize: "clamp(0.72rem,1vw,0.88rem)",
                color: "#1f4a47",
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              {" "}
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#FFDA8C",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                Tanpa BPJS,
              </strong>{" "}
              kendala biaya sering kali menghambat pengobatan dan{" "}
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#FFDA8C",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                menurunkan harapan hidup masyarakat.
              </strong>{" "}
              Sebaliknya,
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#B4F1E1",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                kehadiran JKN efektif menghapus batasan ekonomi
              </strong>{" "}
              tersebut, di mana akses layanan yang lebih luas berperan penting dalam{" "}
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#FFDBDD",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                meningkatkan Angka Harapan Hidup (AHH).
              </strong>
            </p>
          </div>

          <div
            style={{
              ...reveal(0.25),
              display: "flex",
              flexDirection: "column",
              gap: 7,
            }}
          >
            {PIE_DATA.map((d, i) => (
              <div
                key={i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "7px 13px",
                  borderRadius: 10,
                  background:
                    hovered === i ? `${d.color}18` : "rgba(255,255,255,0.35)",
                  border: `1px solid ${hovered === i ? d.color + "55" : "rgba(255,255,255,0.5)"}`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  backdropFilter: "blur(6px)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: d.color,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "clamp(0.6rem,0.85vw,0.78rem)",
                    color: "#1f4a47",
                    flex: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {d.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Bricolage Grotesque',sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(0.85rem,1.1vw,1rem)",
                    color: d.color,
                  }}
                >
                  {d.value.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            ...reveal(0.2),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: "clamp(0.52rem,0.75vw,0.68rem)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase" as const,
              color: "#0C2726",
              textAlign: "center",
              marginBottom: 10,
              lineHeight: 1.4,
            }}
          >
            Persentase Penduduk Sulawesi Barat
            <br />
            yang Memiliki Jaminan Kesehatan Tahun 2024
          </div>
          <div style={{ width: "min(420px,100%)" }}>
            <DonutChart hovered={hovered} setHovered={setHovered} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: "clamp(-5rem,-9vh,-4rem)",
            gap: "clamp(1rem,2vh,1.5rem)",
            height: "100%",
          }}
        >
          <div
            style={{
              ...reveal(0.08),
              width: "clamp(80px,12vw,160px)",
              height: "clamp(80px,12vw,160px)",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 40% 35%, #ffffff 0%, #d6f4f0 55%, #a8e2dc 100%)",
              boxShadow: "0 6px 28px rgba(43,167,167,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src="/images/bpjs.png"
              alt="Logo BPJS"
              style={{ width: "72%", height: "72%", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
