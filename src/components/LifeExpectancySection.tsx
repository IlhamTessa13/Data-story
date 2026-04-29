import { useEffect, useRef, useState } from "react";

const ahhData = [
  { year: 2018, lakiLaki: 62.76, perempuan: 66.47 },
  { year: 2019, lakiLaki: 62.96, perempuan: 66.78 },
  { year: 2020, lakiLaki: 63.2, perempuan: 67.02 },
  { year: 2021, lakiLaki: 63.39, perempuan: 67.19 },
  { year: 2022, lakiLaki: 63.74, perempuan: 67.6 },
  { year: 2023, lakiLaki: 64.11, perempuan: 68.0 },
  { year: 2024, lakiLaki: 64.37, perempuan: 68.27 },
];

const W = 480,
  H = 200;
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

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function LifeExpectancySection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.05 },
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => setProgress(0), 400);
      return () => clearTimeout(t);
    }
    setProgress(0);
    let raf: number,
      start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1600, 1);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  useEffect(() => {
    document.documentElement.style.setProperty("--map-fade-opacity", "0");

    const handleScroll = () => {
      if (!wrapperRef.current || !sectionRef.current) return;

      const wRect = wrapperRef.current.getBoundingClientRect();
      const sectionH = sectionRef.current.offsetHeight;
      const vh = window.innerHeight;
      const scrolled = -wRect.top;

      const wrapperBottom = wRect.bottom;
      if (wrapperBottom < 0) {
        return;
      }

      const fadeStart = sectionH * (1 / 3);
      const fadeEnd = sectionH * (1 / 3) + vh * 0.6;

      let t: number;
      if (scrolled <= fadeStart) {
        t = 0;
      } else if (scrolled >= fadeEnd) {
        t = 1;
      } else {
        t = (scrolled - fadeStart) / (fadeEnd - fadeStart);
      }

      const eased = easeInOut(t);
      setOverlayOpacity(1 - eased);

      const globeT = Math.max(0, (t - 0.2) / 0.8);
      const globeEased = easeInOut(Math.min(1, globeT));
      document.documentElement.style.setProperty(
        "--map-fade-opacity",
        String(globeEased),
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.documentElement.style.setProperty("--map-fade-opacity", "1");
    };
  }, []);

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
    <div ref={wrapperRef} style={{ position: "relative", zIndex: 2 }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          minHeight: "100vh",
          opacity: overlayOpacity,
          willChange: "opacity",
          isolation: "isolate",
          zIndex: 1,
          WebkitMaskImage:
            "linear-gradient(to bottom, black 60%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, #D4F5EE 0%, #E8FAF6 40%, #effaf8 70%, #effaf8 100%)",
          }}
        />
        <img
          src="/images/grad2.png"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            pointerEvents: "none",
            opacity: 1,
          }}
        />
        <section
          ref={sectionRef}
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            padding: "clamp(2.5rem,6vh,5rem) clamp(1.5rem,7vw,8rem)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                ...reveal(0.05),
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "2rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 28,
                  height: 2,
                  background: "#F1BD1E",
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase" as const,
                  color: "#F1BD1E",
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
              }}
            >
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
                        fontFamily: "'Bricolage Grotesque', serif",
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
                        fontFamily: "'Lora', sans-serif",
                        fontStyle: "italic",
                        fontWeight: 800,
                        fontSize: "clamp(1.1rem, 2.2vw, 1.8rem)",
                        color: "#0C2726",
                        display: "block",
                      }}
                    >
                      menurut jenis kelamin
                    </span>
                  </h2>
                </div>
                <div style={reveal(0.2)}>
                  <p
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "clamp(0.82rem, 1.3vw, 0.96rem)",
                      fontWeight: 500,
                      color: "#1a3a32",
                      lineHeight: 1.85,
                      margin: "0 0 1.6rem",
                    }}
                  >
                    <strong
                      style={{
                        fontWeight: 700,
                        backgroundColor: "#FFDA8C",
                        padding: "2px 4px",
                        borderRadius: "4px",
                      }}
                    >
                      AHH perempuan
                    </strong>{" "}
                    di Sulbar secara{" "}
                    <strong
                      style={{
                        fontWeight: 700,
                        backgroundColor: "#FFDA8C",
                        padding: "2px 4px",
                        borderRadius: "4px",
                      }}
                    >
                      konsisten lebih tinggi
                    </strong>{" "}
                    dibandingkan{" "}
                    <strong
                      style={{
                        fontWeight: 700,
                        backgroundColor: "#FFDA8C",
                        padding: "2px 4px",
                        borderRadius: "4px",
                      }}
                    >
                      laki-laki
                    </strong>{" "}
                    — sesuai pola nasional. Namun keduanya masih berada{" "}
                    <strong
                      style={{
                        fontWeight: 700,
                        backgroundColor: "#FFDBDD",
                        padding: "2px 4px",
                        borderRadius: "4px",
                      }}
                    >
                      di bawah rata-rata nasional,
                    </strong>{" "}
                    mencerminkan tantangan sistemik yang belum teratasi.
                  </p>
                </div>
                <div
                  style={{
                    ...reveal(0.3),
                    display: "flex",
                    gap: "0.9rem",
                    flexWrap: "wrap",
                    marginTop: "0.4rem",
                  }}
                >
                  <div
                    style={{
                      background: "#FFD6D3",
                      border: "1.5px solid rgba(255,150,145,0.45)",
                      borderRadius: 14,
                      padding: "0.75rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      boxShadow: "0 4px 18px rgba(219,96,88,0.18)",
                      minWidth: 170,
                    }}
                  >
                    <img
                      src="/images/woman.png"
                      alt="Perempuan"
                      style={{
                        width: "clamp(32px,5vw,44px)",
                        height: "clamp(32px,5vw,44px)",
                        objectFit: "contain",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "0.56rem",
                          fontWeight: 800,
                          letterSpacing: "0.11em",
                          textTransform: "uppercase" as const,
                          color: "#000",
                          marginBottom: "0.2rem",
                        }}
                      >
                        AHH Perempuan 2024
                      </div>
                      <div
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontWeight: 800,
                          fontSize: "1.45rem",
                          color: "#C0392B",
                          lineHeight: 1,
                        }}
                      >
                        68,27
                        <span
                          style={{
                            fontSize: "0.58rem",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 600,
                            marginLeft: 3,
                            color: "#C0392B",
                          }}
                        >
                          TAHUN
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#C9E9FF",
                      border: "1.5px solid rgba(100,180,255,0.45)",
                      borderRadius: 14,
                      padding: "0.75rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      boxShadow: "0 4px 18px rgba(60,130,220,0.16)",
                      minWidth: 170,
                    }}
                  >
                    <img
                      src="/images/man.png"
                      alt="Laki-laki"
                      style={{
                        width: "clamp(32px,5vw,44px)",
                        height: "clamp(32px,5vw,44px)",
                        objectFit: "contain",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: "0.56rem",
                          fontWeight: 800,
                          letterSpacing: "0.11em",
                          textTransform: "uppercase" as const,
                          color: "#000",
                          marginBottom: "0.2rem",
                        }}
                      >
                        AHH Laki-laki 2024
                      </div>
                      <div
                        style={{
                          fontFamily: "'Bricolage Grotesque', sans-serif",
                          fontWeight: 800,
                          fontSize: "1.45rem",
                          color: "#1565C0",
                          lineHeight: 1,
                        }}
                      >
                        64,37
                        <span
                          style={{
                            fontSize: "0.58rem",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 600,
                            marginLeft: 3,
                            color: "#1565C0",
                          }}
                        >
                          TAHUN
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  ...reveal(0.15),
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    background: "rgba(197, 237, 234, 0.55)",
                    borderRadius: 20,
                    padding: "16px 24px 20px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 2px 16px rgba(0,80,60,0.07)",
                  }}
                >
                  <div style={{ textAlign: "center", marginBottom: "0.3rem" }}>
                    <img
                      src="/images/bunga4.png"
                      alt=""
                      aria-hidden="true"
                      className="float-spin"
                      style={{
                        width: "clamp(60px,9vw,100px)",
                        objectFit: "contain",
                        display: "inline-block",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase" as const,
                      color: "#2C3E35",
                      textAlign: "center",
                      marginBottom: "0.4rem",
                    }}
                  >
                    AHH Sulbar Menurut Jenis Kelamin (2018–2024)
                  </div>
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
                  <svg
                    viewBox={`0 0 ${W} ${H}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      flex: 1,
                      overflow: "visible",
                    }}
                  >
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
                    <path
                      d={prPath}
                      fill="none"
                      stroke="#DB6058"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={`${pathLength} ${pathLength}`}
                      strokeDashoffset={pathLength * (1 - progress)}
                      style={{ transition: "stroke-dashoffset 0.05s linear" }}
                    />
                    <path
                      d={llPath}
                      fill="none"
                      stroke="#2DD4BF"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={`5 3 ${pathLength} ${pathLength}`}
                      strokeDashoffset={pathLength * (1 - progress)}
                      style={{ transition: "stroke-dashoffset 0.05s linear" }}
                    />
                    {ahhData.map((d, i) => (
                      <g
                        key={`dot-${i}`}
                        opacity={
                          progress > (i / (ahhData.length - 1)) * 0.85 ? 1 : 0
                        }
                        style={{ transition: "opacity 0.3s" }}
                      >
                        <circle
                          cx={scaleX(i, ahhData.length)}
                          cy={scaleY(d.perempuan, minV, maxV)}
                          r={3.5}
                          fill="#DB6058"
                          stroke="white"
                          strokeWidth={1.5}
                        />
                        <circle
                          cx={scaleX(i, ahhData.length)}
                          cy={scaleY(d.lakiLaki, minV, maxV)}
                          r={3.5}
                          fill="#2DD4BF"
                          stroke="white"
                          strokeWidth={1.5}
                        />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
        // Strip bawah — ganti #effaf8 → #f4fefd
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "18vh",
            background: "linear-gradient(to bottom, transparent, #f4fefd)", // ← ubah di sini
            pointerEvents: "none",
          }}
        />
      </div>

      <div style={{ height: "220vh" }} />
    </div>
  );
}
