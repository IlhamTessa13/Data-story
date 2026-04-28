// FacilitySection.tsx
// "Jumlah Fasilitas Per Kabupaten" section
import { useEffect, useRef, useState } from "react";

const kabData = [
  { name: "Majene", faskes: 13 },
  { name: "Polewali Mandar", faskes: 24 },
  { name: "Mamasa", faskes: 20 },
  { name: "Mamuju", faskes: 29 },
  { name: "Pasangkayu", faskes: 16 },
  { name: "Mamuju Tengah", faskes: 12 },
];

const MAX = Math.max(...kabData.map((d) => d.faskes));
const MIN = Math.min(...kabData.map((d) => d.faskes));

const barColor = (faskes: number) => {
  if (faskes === MAX) return "#1d9e75";
  if (faskes === MIN) return "#DB6058";
  return "#5DCAA5";
};

export default function FacilitySection() {
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
      {/* ── CSS Animations untuk Bunga Mengambang ── */}
      <style>
        {`
          @keyframes float-anim-flower {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(2deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }
          .bunga-animasi {
            animation: float-anim-flower 4s ease-in-out infinite;
          }
        `}
      </style>

      {/* ── Section label ── */}
      <div
        style={{
          ...reveal(0.05),
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "1.5rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 28,
            height: 2,
            background: "#e3ba16",
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
            color: "#e3ba16",
          }}
        >
          Fasilitas Kesehatan
        </span>
      </div>

      {/* ── Main grid: text left + chart right ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: "clamp(2rem,5vw,5rem)" /* Sedikit memperlebar gap antar kolom */,
          alignItems: "start",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ── LEFT: headline + paragraphs ── */}
        <div>
          <div style={reveal(0.12)}>
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.6vw, 3rem)",
                color: "#DB6058",
                margin: "0 0 1.2rem" /* Menambah jarak bawah judul */,
                lineHeight: 1.15,
              }}
            >
              <div>Jumlah Fasilitas</div>
              <span
                style={{
                  fontFamily: "'Lora', serif",
                  fontStyle: "italic",
                  color: "#000000",
                  display: "block",
                  marginTop: "0.2rem",
                }}
              >
                Per Kabupaten
              </span>
            </h2>
          </div>

          {/* ── PARAGRAF INTERPRETASI DATA ── */}
          <div style={reveal(0.18)}>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(0.85rem, 1.4vw, 1rem)",
                color: "#334155",
                lineHeight: 1.75,
                margin: "0 0 1.5rem 0",
                textAlign: "justify",
              }}
            >
              Data di samping mengungkap {""}
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#FFDA8C",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                ketimpangan struktural yang nyata.
              </strong>
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#B3FF6D",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                {" "}
                Mamuju
              </strong>{" "}
              sebagai ibu kota
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#B3FF6D",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                mendominasi
              </strong>{" "}
              dengan
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#B3FF6D",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                29 unit
              </strong>
              , berbanding terbalik dengan
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#FFDBDD",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                Mamuju Tengah
              </strong>{" "}
              yang
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#FFDBDD",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                tertinggal
              </strong>{" "}
              di angka
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#FFDBDD",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                12 unit
              </strong>
              . Kesenjangan ini sangat fatal. Di tengah lanskap geografis Sulbar
              yang berbukit, jarak tempuh yang jauh menuju fasilitas terdekat
              bukan sekadar masalah waktu, melainkan penentu keselamatan nyawa.
            </p>
          </div>

          {/* Box paragraph — berlatar Rectangle19.webp dengan Glassmorphism/Overlay */}
          <div
            style={{
              ...reveal(0.24),
              position: "relative",
              borderRadius: 16 /* Sudut lebih membulat */,
              overflow: "hidden",
              boxShadow:
                "0 8px 25px rgba(0,0,0,0.06)" /* Tambahan bayangan agar elegan */,
            }}
          >
            {/* Rectangle19 sebagai background */}
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
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 0,
              }}
            />
            {/* OVERLAY: Lapisan putih semi-transparan agar teks terbaca jelas */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "rgba(255, 255, 255, 0.82)" /* Transparansi putih 82% */,
                backdropFilter:
                  "blur(4px)" /* Efek blur ala Apple/Glassmorphism */,
                zIndex: 1,
              }}
            />

            <p
              style={{
                position: "relative",
                zIndex: 2 /* Harus di atas overlay */,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(0.82rem, 1.3vw, 0.95rem)",
                color: "#1a3a32",
                lineHeight: 1.85,
                margin: 0,
                padding: "18px 20px" /* Padding diperbesar sedikit */,
                textAlign: "justify",
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
                Puskesmas
              </strong>{" "}

              hadir sebagai ujung tombak layanan
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#FFDA8C",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                promotif
              </strong>{" "}
              dan
              <strong
                style={{
                  fontWeight: 700,
                  backgroundColor: "#FFDA8C",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                preventif
              </strong>
              . Namun, jumlah fasilitas ini tidak akan berarti jika lokasinya
              tak mampu dijangkau oleh warga di pelosok.
            </p>
          </div>
        </div>

        {/* ── RIGHT: bar chart card ── */}
        <div style={reveal(0.2)}>
          {/* Chart card */}
          <div
            style={{
              background: "#C5EDEA",
              borderRadius: 24 /* Sudut lebih membulat agar ramah visual */,
              padding: "24px 24px 22px" /* Padding sedikit diperbesar */,
              border:
                "2px solid rgba(255,255,255,0.8)" /* Border sedikit ditebalkan */,
              boxShadow:
                "0 12px 35px rgba(12, 39, 38, 0.08)" /* BAYANGAN ditambahkan di sini */,
              position: "relative",
            }}
          >
            {/* Bunga2 menempel di atas judul chart dengan Animasi */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "8px",
              }}
            >
              <img
                src="/images/bunga3.png"
                alt=""
                aria-hidden="true"
                className="bunga-animasi" /* <-- Penambahan Class Animasi */
                style={{
                  width: "clamp(100px, 11vw, 110px)",
                  height: "auto",
                  objectFit: "contain",
                  pointerEvents: "none",
                  userSelect: "none",
                  display: "block",
                  filter:
                    "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" /* Sedikit bayangan pada bunga */,
                }}
              />
            </div>

            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#0C2726",
                marginBottom: "6px",
                textAlign: "center",
              }}
            >
              Distribusi Fasilitas per Kabupaten/Kota Tahun 2024
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: "6px 14px",
                marginBottom: "1.5rem",
                marginTop: "8px",
              }}
            >
              {[
                { color: "#1d9e75", label: "Terbanyak" },
                { color: "#5DCAA5", label: "Rata-rata" },
                { color: "#DB6058", label: "Tersedikit" },
              ].map(({ color, label }) => (
                <span
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    color: "#1a3a32",
                  }}
                >
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius:
                        "50%" /* Legend dibuat bulat, bukan kotak (lebih modern) */,
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  {label}
                </span>
              ))}
            </div>

            {/* Horizontal bars */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {kabData.map((kab, i) => (
                <div
                  key={kab.name}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.6s ease ${0.28 + i * 0.07}s, transform 0.6s ease ${0.28 + i * 0.07}s`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#334155",
                      }}
                    >
                      {kab.name}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        color: barColor(kab.faskes),
                      }}
                    >
                      {kab.faskes}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 12 /* Bar sedikit lebih tebal */,
                      background: "rgba(0,0,0,0.06)",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: visible ? `${(kab.faskes / MAX) * 100}%` : "0%",
                        background: barColor(kab.faskes),
                        borderRadius: 10,
                        transition: `width 1s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.35 + i * 0.08}s` /* Animasi lebih bouncy */,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
