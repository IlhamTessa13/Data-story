// LifeExpectancySection.tsx
// Tren AHH Sulbar Menurut Jenis Kelamin — data Laki-laki & Perempuan
import { useEffect, useRef, useState } from "react";

// Data AHH Sulbar per jenis kelamin (dari tabel BPS)
const ahhData = [
  { year: 2018, lakiLaki: 62.76, perempuan: 66.47 },
  { year: 2019, lakiLaki: 62.96, perempuan: 66.78 },
  { year: 2020, lakiLaki: 63.2, perempuan: 67.02 },
  { year: 2021, lakiLaki: 63.39, perempuan: 67.19 },
  { year: 2022, lakiLaki: 63.74, perempuan: 67.6 },
  { year: 2023, lakiLaki: 64.11, perempuan: 68.0 },
  { year: 2024, lakiLaki: 64.37, perempuan: 68.27 },
];

const W = 480;
const H = 200;
const PAD = { top: 24, right: 24, bottom: 36, left: 44 };

function scaleX(i: number, total: number) {
  return PAD.left + (i / (total - 1)) * (W - PAD.left - PAD.right);
}
function scaleY(val: number, minV: number, maxV: number) {
  return PAD.top + ((maxV - val) / (maxV - minV)) * (H - PAD.top - PAD.bottom);
}
function buildPath(data: number[], minV: number, maxV: number) {
  return data
    .map(
      (v, i) =>
        `${i === 0 ? "M" : "L"} ${scaleX(i, data.length).toFixed(1)} ${scaleY(v, minV, maxV).toFixed(1)}`,
    )
    .join(" ");
}

export default function LifeExpectancySection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
      },
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      // Ketika section tidak terlihat, reset progress agar animasi mulai ulang
      const timer = setTimeout(() => setProgress(0), 400);
      return () => clearTimeout(timer);
    }
    setProgress(0);
    let raf: number;
    let start: number | null = null;
    const dur = 1600;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  const llVals = ahhData.map((d) => d.lakiLaki);
  const prVals = ahhData.map((d) => d.perempuan);
  const allVals = [...llVals, ...prVals];
  const minV = Math.floor(Math.min(...allVals)) - 1;
  const maxV = Math.ceil(Math.max(...allVals)) + 1;

  const llPath = buildPath(llVals, minV, maxV);
  const prPath = buildPath(prVals, minV, maxV);
  const pathLength = 700;
  const yTicks = [60, 63, 66, 69, 72];

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background:
          "radial-gradient(ellipse at 100% 50%, #B8FFE7 0%, #F5FFFE 65%)",
        minHeight: "100vh",
        padding: "clamp(2.5rem,6vh,5rem) clamp(1.5rem,7vw,8rem)",
        overflow: "hidden",
        zIndex: 2,
        isolation: "isolate",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Ornamen bunga dihapus sesuai permintaan */}

      {/* Section label */}
      <div
        style={{
          ...reveal(0.05),
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 28,
            height: 2,
            background: "#0C2726",
            borderRadius: 2,
          }}
        />
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#0C2726",
          }}
        >
          Tren Angka Harapan Hidup
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: "clamp(2rem,5vw,4rem)",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ===== KIRI ===== */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={reveal(0.12)}>
            <h2 style={{ margin: "0 0 1rem", lineHeight: 1.15 }}>
              <span
                style={{
                  fontFamily: "'Lora', serif",
                  fontStyle: "italic",
                  fontWeight: 800,
                  fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)",
                  color: "#DB6058",
                  display: "block",
                }}
              >
                Tren AHH Sulbar
              </span>
              <span
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)",
                  color: "#0C2726",
                  display: "block",
                }}
              >
                Menurut Jenis Kelamin
              </span>
            </h2>
          </div>

          <div style={reveal(0.2)}>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(0.92rem, 1.5vw, 1.1rem)",
                fontWeight: 600,
                color: "#1a3a32",
                lineHeight: 1.9,
                margin: "0 0 1.4rem",
              }}
            >
              AHH perempuan di Sulbar secara konsisten lebih tinggi dibandingkan
              laki-laki — sesuai pola nasional. Namun keduanya masih berada di
              bawah rata-rata nasional, mencerminkan tantangan sistemik yang
              belum teratasi.
            </p>
          </div>

          {/* Highlight pills */}
          <div
            style={{
              ...reveal(0.3),
              display: "flex",
              gap: "0.8rem",
              flexWrap: "wrap",
              marginTop: "0.5rem",
            }}
          >
            <div
              style={{
                background: "rgba(45,212,191,0.15)",
                border: "1.5px solid #2DD4BF",
                borderRadius: 12,
                padding: "0.7rem 1.1rem",
              }}
            >
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#0C8C7C",
                  marginBottom: "0.2rem",
                }}
              >
                Perempuan 2024
              </div>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  color: "#0C8C7C",
                }}
              >
                68,27{" "}
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  tahun
                </span>
              </div>
            </div>
            <div
              style={{
                background: "rgba(219,96,88,0.12)",
                border: "1.5px solid #DB6058",
                borderRadius: 12,
                padding: "0.7rem 1.1rem",
              }}
            >
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#DB6058",
                  marginBottom: "0.2rem",
                }}
              >
                Laki-laki 2024
              </div>
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.3rem",
                  color: "#DB6058",
                }}
              >
                64,37{" "}
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  tahun
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== KANAN — Card Line Chart ===== */}
        <div
          style={{ ...reveal(0.15), display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              background: "#C5EDEA",
              borderRadius: 20,
              padding: "16px 24px 20px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              position: "relative",
              boxShadow: "0 2px 16px rgba(0,80,60,0.07)",
            }}
          >
            {/* Bunga tengah atas */}
            <div
              style={{
                textAlign: "center",
                position: "relative",
                zIndex: 3,
                marginBottom: "0.3rem",
              }}
            >
              <img
                src="/images/bunga4.png"
                alt=""
                aria-hidden="true"
                className="float-spin"
                style={{
                  width: "clamp(60px, 9vw, 100px)",
                  objectFit: "contain",
                  display: "inline-block",
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.1))",
                }}
              />
            </div>

            {/* Chart title */}
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#2C3E35",
                textAlign: "center",
                marginBottom: "0.4rem",
              }}
            >
              AHH Sulbar Menurut Jenis Kelamin (2018–2024)
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1.4rem",
                marginBottom: "0.8rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { color: "#2DD4BF", label: "Perempuan", dashed: false },
                { color: "#DB6058", label: "Laki-laki", dashed: true },
              ].map((item) => (
                <span
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    color: "#64748b",
                  }}
                >
                  <svg width="22" height="10">
                    <line
                      x1="0"
                      y1="5"
                      x2="22"
                      y2="5"
                      stroke={item.color}
                      strokeWidth="2.5"
                      strokeDasharray={item.dashed ? "5 3" : undefined}
                      strokeLinecap="round"
                    />
                  </svg>
                  {item.label}
                </span>
              ))}
            </div>

            {/* SVG Line Chart */}
            <svg
              viewBox={`0 0 ${W} ${H}`}
              style={{
                width: "100%",
                height: "auto",
                flex: 1,
                overflow: "visible",
              }}
            >
              {/* Grid lines + Y ticks */}
              {yTicks.map((v) => (
                <g key={v}>
                  <line
                    x1={PAD.left}
                    y1={scaleY(v, minV, maxV)}
                    x2={W - PAD.right}
                    y2={scaleY(v, minV, maxV)}
                    stroke="rgba(0,0,0,0.07)"
                    strokeWidth={1}
                  />
                  <text
                    x={PAD.left - 6}
                    y={scaleY(v, minV, maxV) + 4}
                    textAnchor="end"
                    fontSize={8}
                    fill="#94a3b8"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {v}
                  </text>
                </g>
              ))}

              {/* X axis labels */}
              {ahhData.map((d, i) => (
                <text
                  key={d.year}
                  x={scaleX(i, ahhData.length)}
                  y={H - 4}
                  textAnchor="middle"
                  fontSize={8}
                  fill="#94a3b8"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                >
                  {d.year}
                </text>
              ))}

              {/* Perempuan line */}
              <path
                d={prPath}
                fill="none"
                stroke="#2DD4BF"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${pathLength} ${pathLength}`}
                strokeDashoffset={pathLength * (1 - progress)}
                style={{ transition: "stroke-dashoffset 0.05s linear" }}
              />

              {/* Laki-laki line */}
              <path
                d={llPath}
                fill="none"
                stroke="#DB6058"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`5 3 ${pathLength} ${pathLength}`}
                strokeDashoffset={pathLength * (1 - progress)}
                style={{ transition: "stroke-dashoffset 0.05s linear" }}
              />

              {/* Dots */}
              {ahhData.map((d, i) => (
                <g
                  key={`dot-${i}`}
                  opacity={progress > (i / (ahhData.length - 1)) * 0.85 ? 1 : 0}
                  style={{ transition: "opacity 0.3s" }}
                >
                  <circle
                    cx={scaleX(i, ahhData.length)}
                    cy={scaleY(d.perempuan, minV, maxV)}
                    r={3.5}
                    fill="#2DD4BF"
                    stroke="white"
                    strokeWidth={1.5}
                  />
                  <circle
                    cx={scaleX(i, ahhData.length)}
                    cy={scaleY(d.lakiLaki, minV, maxV)}
                    r={3.5}
                    fill="#DB6058"
                    stroke="white"
                    strokeWidth={1.5}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
