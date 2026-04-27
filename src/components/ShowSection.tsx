// src/components/ShowSection.tsx
import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Kasus Ditangani", value: "12.847", icon: "🏥" },
  { label: "Puskesmas Aktif", value: "156", icon: "🏨" },
  { label: "Dokter Bertugas", value: "423", icon: "👨‍⚕️" },
  { label: "Pasien Sembuh", value: "11.204", icon: "💊" },
];

const highlights = [
  {
    title: "Program Kesehatan Ibu & Anak",
    desc: "Cakupan imunisasi dasar lengkap meningkat signifikan di seluruh kabupaten Sulbar tahun 2024.",
    color: "#C5EDEA",
    accent: "#1d9e75",
  },
  {
    title: "Penanganan Stunting",
    desc: "Prevalensi stunting turun dari 35% menjadi 28% berkat intervensi gizi terpadu lintas sektor.",
    color: "#FFF3CD",
    accent: "#C9960F",
  },
  {
    title: "Telemedisin Daerah Terpencil",
    desc: "Layanan konsultasi dokter jarak jauh kini menjangkau 47 desa terpencil di pegunungan Mamasa.",
    color: "#FCE8E6",
    accent: "#C0392B",
  },
];

export default function ShowSection() {
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

  const reveal = (delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
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
      {/* Section label */}
      <div
        style={{
          ...reveal(0.05),
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "0.6rem",
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
          Sorotan Program
        </span>
      </div>

      {/* Heading */}
      <div style={reveal(0.1)}>
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(1.8rem, 4vw, 3rem)",
            color: "#0C2726",
            lineHeight: 1.2,
            margin: "0 0 0.4rem",
          }}
        >
          Capaian Kesehatan
        </h2>
        <p
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            fontSize: "clamp(1rem, 1.8vw, 1.3rem)",
            color: "#1d9e75",
            margin: "0 0 2.5rem",
          }}
        >
          Sulawesi Barat 2024
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          ...reveal(0.15),
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{
              background: "rgba(255,255,255,0.7)",
              borderRadius: 16,
              padding: "1.2rem 1rem",
              textAlign: "center",
              border: "1px solid rgba(29,158,117,0.15)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.6s ease ${0.2 + i * 0.08}s, transform 0.6s ease ${0.2 + i * 0.08}s`,
            }}
          >
            <div style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>
              {s.icon}
            </div>
            <div
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                color: "#C0392B",
                lineHeight: 1,
                letterSpacing: "-1px",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "#64748b",
                marginTop: "0.3rem",
                lineHeight: 1.3,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Highlight cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: "1.2rem",
        }}
      >
        {highlights.map((h, i) => (
          <div
            key={h.title}
            style={{
              background: h.color,
              borderRadius: 16,
              padding: "1.4rem 1.2rem",
              borderLeft: `4px solid ${h.accent}`,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: `opacity 0.7s ease ${0.3 + i * 0.1}s, transform 0.7s ease ${0.3 + i * 0.1}s`,
            }}
          >
            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(0.85rem, 1.4vw, 1rem)",
                color: "#0C2726",
                marginBottom: "0.5rem",
              }}
            >
              {h.title}
            </div>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(0.78rem, 1.2vw, 0.9rem)",
                color: "#1a3a32",
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              {h.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
