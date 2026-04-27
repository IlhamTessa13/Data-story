// MedicalSection.tsx
import { useEffect, useRef, useState } from "react";

const nakesData = [
  { label: "Dokter Umum", value: 380 },
  { label: "Dokter Spesialis", value: 120 },
  { label: "Perawat", value: 980 },
  { label: "Bidan", value: 620 },
  { label: "Apoteker", value: 150 },
  { label: "Lainnya", value: 120 },
];

const MAX_VAL = 980;

export default function MedicalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
      },
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

  // Chart lebih tinggi agar sejajar konten kanan
  const CHART_H = 340;
  const BAR_COLOR = "#3DBFA0";
  const yTicks = [0, 200, 400, 600, 800, 1000];

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
            background: "#1d9e75",
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
            color: "#C9960F",
          }}
        >
          Tenaga Medis
        </span>
      </div>

      {/* Grid: Chart KIRI + Teks KANAN */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "clamp(2rem,5vw,4rem)",
          alignItems: "stretch",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ===== KIRI — Vertical Bar Chart ===== */}
        <div
          style={{ ...reveal(0.1), display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              background: "#C5EDEA",
              borderRadius: 18,
              padding: "0 24px 24px",
              border: "1px solid rgba(255,255,255,0.6)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Bunga di tengah atas card */}
            <div
              style={{
                textAlign: "center",
                marginTop: "-1px",
                marginBottom: "0.5rem",
                position: "relative",
                zIndex: 3,
              }}
            >
              <img
                src="/images/image3.png"
                alt=""
                aria-hidden="true"
                style={{
                  width: "clamp(60px, 8vw, 88px)",
                  objectFit: "contain",
                  display: "inline-block",
                  marginTop: "-20px",
                  filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.08))",
                }}
              />
            </div>

            {/* Chart title */}
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
              Distribusi Per Jenis Tenaga
            </div>

            {/* Bar chart wrapper — flex: 1 agar mengisi sisa ruang */}
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                gap: 0,
                flex: 1,
                minHeight: 0,
              }}
            >
              {/* Y-axis ticks */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  justifyContent: "space-between",
                  flex: 1,
                  maxWidth: 32,
                  marginRight: 8,
                  flexShrink: 0,
                  paddingBottom: 36, // ruang untuk x-label
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
                    {tick === 0 ? "0" : tick >= 1000 ? `${tick / 1000}K` : tick}
                  </span>
                ))}
              </div>

              {/* Bars + X labels */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                {/* Bar area */}
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

                  {/* Bars row */}
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
                        {/* Value on top of bar */}
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
                        {/* Bar */}
                        <div
                          style={{
                            width: "100%",
                            background: BAR_COLOR,
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

                {/* X-axis labels */}
                <div
                  style={{
                    display: "flex",
                    gap: "clamp(6px,2%,14px)",
                    padding: "8px 4px 0",
                    height: 36,
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

        {/* ===== KANAN — Teks & Statistik ===== */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Big number + subtitle — rata tengah */}
          <div
            style={{
              ...reveal(0.12),
              textAlign: "center",
              marginBottom: "1.6rem",
            }}
          >
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(4rem, 9vw, 7.5rem)",
                color: "#C0392B",
                lineHeight: 1,
                letterSpacing: "-2px",
              }}
            >
              2370
            </div>
            <div
              style={{
                fontFamily: "'Lora', serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(1.1rem, 2.2vw, 1.7rem)",
                color: "#1a1a1a",
                lineHeight: 1.3,
                marginTop: "0.25rem",
              }}
            >
              total nakes
              <br />
              Sulbar
            </div>
          </div>

          {/* Narrative text */}
          <div style={reveal(0.22)}>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(0.82rem, 1.3vw, 0.95rem)",
                color: "#1a3a32",
                lineHeight: 1.85,
                margin: 0,
              }}
            >
              Sedikit pun kekurangan nakes di daerah terpencil bisa berdampak
              besar pada kualitas dan kecepatan penanganan pasien. Rasio dokter
              terhadap penduduk di Sulbar masih jauh di bawah standar WHO.
            </p>
          </div>

          {/* Box paragraph — Rectangle 19 background */}
          <div
            style={{
              ...reveal(0.3),
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              marginTop: "1.2rem",
            }}
          >
            <img
              src="/images/Rectangle 19.webp"
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
              }}
            />
            <p
              style={{
                position: "relative",
                zIndex: 1,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(0.82rem, 1.3vw, 0.95rem)",
                color: "#1a3a32",
                lineHeight: 1.85,
                margin: 0,
                padding: "13px 16px",
              }}
            >
              Ketersediaan tenaga kesehatan sangat krusial. Puskesmas bergantung
              pada <strong>bidan</strong> yang sedang masa dinas, namun rasio
              dokter masih di bawah standar WHO.
            </p>
          </div>

          {/* Additional paragraph */}
          <div style={reveal(0.38)}>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(0.82rem, 1.3vw, 0.95rem)",
                color: "#1a3a32",
                lineHeight: 1.85,
                marginTop: "1rem",
                marginBottom: 0,
              }}
            >
              Satu dokter di Sulbar rata-rata harus melayani dua kali lebih
              banyak penduduk dibandingkan rata-rata nasional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
