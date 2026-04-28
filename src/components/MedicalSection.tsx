import { useEffect, useRef, useState } from "react";

const nakesData = [
  { label: "Majene", value: 89 },
  { label: "Polewali Mandar", value: 241 },
  { label: "Mamasa", value: 67 },
  { label: "Mamuju", value: 233 },
  { label: "Pasangkayu", value: 87 },
  { label: "Mamuju Tengah", value: 53 },
];

const MAX_VAL = 300;
const yTicks = [0, 50, 100, 150, 200, 250, 300];

const maxVal = Math.max(...nakesData.map((d) => d.value));
const minVal = Math.min(...nakesData.map((d) => d.value));

function getBarColor(value: number): string {
  if (value === maxVal) return "#2563EB";
  if (value === minVal) return "#F97316";
  return "#3DBFA0";
}

export default function MedicalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.08 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const reveal = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "transparent",
        padding: "clamp(3rem,8vh,6rem) clamp(1.5rem,7vw,8rem)",
        overflow: "hidden",
      }}
    >
      {/* ornamen11 — kanan */}
      <img
        src="/images/ornamen11.png"
        alt=""
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          width: "35rem",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.92,
        }}
      />

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
            textTransform: "uppercase",
            color: "#F1BD1E",
          }}
        >
          Tenaga Medis
        </span>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "clamp(2rem,5vw,4rem)",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ===== KIRI — Bar Chart Card ===== */}
        <div
          style={{ ...reveal(0.1), display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              background: "#C5EDEA",
              borderRadius: 18,
              padding: "28px 24px 24px",
              border: "1px solid rgba(255,255,255,0.6)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#2C3E35",
                marginBottom: "1.4rem",
                textAlign: "center",
              }}
            >
              Distribusi Tenaga Medis Per Kabupaten/Kota
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: 0,
                flex: 1,
                minHeight: 260,
              }}
            >
              {/* Y-axis */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  justifyContent: "space-between",
                  maxWidth: 32,
                  marginRight: 8,
                  flexShrink: 0,
                  paddingBottom: 40,
                }}
              >
                {yTicks.map((tick) => (
                  <span
                    key={tick}
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: "0.58rem",
                      color: "#94a3b8",
                      lineHeight: 1,
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    {tick}
                  </span>
                ))}
              </div>

              {/* Bars area */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
                  {/* Grid lines */}
                  {yTicks.map((tick) => (
                    <div
                      key={tick}
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: `${(tick / MAX_VAL) * 100}%`,
                        height: "1px",
                        background: "rgba(0,0,0,0.08)",
                        zIndex: 0,
                      }}
                    />
                  ))}

                  {/* Bars */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "clamp(6px,2%,14px)",
                      padding: "0 4px",
                      zIndex: 1,
                    }}
                  >
                    {nakesData.map((item, i) => (
                      <div
                        key={item.label}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          height: "100%",
                          justifyContent: "flex-end",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: "clamp(0.48rem, 0.75vw, 0.62rem)",
                            fontWeight: 700,
                            color: "#2C7A60",
                            marginBottom: 4,
                            opacity: visible ? 1 : 0,
                            transition: `opacity 0.5s ease ${0.5 + i * 0.07}s`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.value}
                        </span>
                        <div
                          style={{
                            width: "100%",
                            background: getBarColor(item.value),
                            borderRadius: "8px 8px 4px 4px",
                            height: visible
                              ? `${(item.value / MAX_VAL) * 100}%`
                              : "0%",
                            transition: `height 0.9s cubic-bezier(0.34,1.56,0.64,1) ${0.3 + i * 0.08}s`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* X labels */}
                <div
                  style={{
                    display: "flex",
                    gap: "clamp(6px,2%,14px)",
                    padding: "8px 4px 0",
                    height: 40,
                    flexShrink: 0,
                  }}
                >
                  {nakesData.map((item) => (
                    <div
                      key={item.label}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "clamp(0.4rem, 0.62vw, 0.54rem)",
                        fontWeight: 600,
                        color: "#64748b",
                        lineHeight: 1.25,
                      }}
                    >
                      {item.label.split(" ").map((w, wi) => (
                        <span key={wi} style={{ display: "block" }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== KANAN — Center, gambar di belakang angka ===== */}
        <div
          style={{
            ...reveal(0.12),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Wrapper: gambar + angka overlap */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* nakes2.png — di atas, zIndex 1 */}
            <img
              src="/images/nakes2.png"
              alt="Tenaga Kesehatan"
              style={{
                width: "clamp(160px, 22vw, 280px)",
                aspectRatio: "1 / 1",
                objectFit: "cover",
                objectPosition: "center top",
                borderRadius: 20,
                display: "block",
                position: "relative",
                zIndex: 1,
              }}
            />

            {/* Angka — overlap ke gambar, zIndex 2 */}
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(3rem, 6vw, 5.5rem)",
                color: "#C0392B",
                lineHeight: 1,
                letterSpacing: "-2px",
                WebkitTextStroke: "6px white",
                paintOrder: "stroke fill",
                position: "relative",
                zIndex: 2,
                marginTop: "clamp(-2rem, -4vw, -3.5rem)",
              }}
            >
              770
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontFamily: "'Lora', serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(0.95rem, 1.8vw, 1.5rem)",
              color: "#1a1a1a",
              lineHeight: 1.3,
              marginTop: "0.3rem",
            }}
          >
            total nakes
            <br />
            Sulbar
          </div>

          {/* Narrative */}
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(0.82rem, 1.3vw, 0.95rem)",
              color: "#1a3a32",
              lineHeight: 1.85,
              margin: "0.9rem 0 0",
              maxWidth: "36ch",
              fontWeight: 600,
            }}
          >
            Sedikit pun kekurangan nakes di daerah terpencil bisa berdampak
            besar pada kualitas dan kecepatan penanganan pasien. Rasio dokter
            terhadap penduduk di Sulbar masih jauh di bawah standar WHO.
          </p>
        </div>
      </div>
      {/* Gradient fade ke bawah — nyambung ke LifeExpectancy */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "220px",
          background:
             "linear-gradient(to bottom left, transparent 0%, #d5f5ee 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </section>
  );
}
