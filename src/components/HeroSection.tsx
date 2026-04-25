// HeroSection.tsx
// Font imports needed in your index.html or global CSS:
// <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=Lora:ital,wght@0,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const fade = (delay: number, y = 16) => ({
    initial: { opacity: 0, y },
    animate: { opacity: ready ? 1 : 0, y: ready ? 0 : y },
    transition: { duration: 0.7, delay },
  });

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        // The mint/teal background from the reference
        background: "#C5EDEA",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── ornamen2: soft yellow-peach blob, top-right corner ── */}
      <img
        src="/images/ornamen2.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "0%",
          right: "0%",
          width: "100%",
          maxWidth: 780,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 1,
        }}
      />

      {/* ── People illustration — anchored bottom-right ── */}
      <img
        src="/images/people.webp"
        alt="Ilustrasi berbagai generasi"
        style={{
          position: "absolute",
          right: "0%",
          bottom: "20%",
          // Height covers most of the section
          height: "50%",
          maxHeight: 720,
          width: "auto",
          objectFit: "contain",
          objectPosition: "bottom right",
          pointerEvents: "none",
          userSelect: "none",
          // people sit above ornamen2 but below content
          zIndex: 3,
        }}
      />

      {/* ── ornamen1: yellow + teal brush strokes ──
           In reference this floats to the right of/overlapping people  */}
      <img
        src="/images/ornamen1.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          // Roughly center-right, upper area
          top: "25%",
          right: "0%",
          width: "9%",
          maxWidth: 110,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 4,
        }}
      />

      {/* ── Left content column ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh",
          // Horizontal padding keeps text well within left half
          paddingLeft: "clamp(2rem, 7vw, 8rem)",
          paddingRight: "2rem",
          paddingTop: "clamp(4rem, 8vh, 8rem)",
          paddingBottom: "clamp(3rem, 6vh, 6rem)",
          maxWidth: 540,
        }}
      >
        {/* ── Title ── */}
        <motion.h1 {...fade(0.2, 28)} style={{ margin: 0, lineHeight: 1.05 }}>
          {/* "Melawan" — Bricolage Grotesque, red */}
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(3.2rem, 6.8vw, 5.5rem)",
              color: "#DB6058",
              display: "block",
              letterSpacing: "-0.01em",
            }}
          >
            
            Melawan
          </span>
          {/* "Takdir Statistik" — Lora italic-style bold, dark */}
          <span
            style={{
              fontFamily: "'Lora'",
              fontWeight: 700,
              fontSize: "clamp(2.3rem, 5.2vw, 4.2rem)",
              color: "#0C2726",
              display: "block",
              letterSpacing: "-0.005em",
              marginTop: "0.04em",
              fontStyle: "italic",
            }}
          >
            Takdir Statistik
          </span>
        </motion.h1>

        {/* ── Description with ornamen3 as background ── */}
        <motion.div
          {...fade(0.42)}
          style={{
            position: "relative",
            marginTop: "2rem",
            maxWidth: 450,
          }}
        >
          
          
          {/* ornamen3: the warm yellow blob behind the description box */}
          <img
            src="/images/ornamen3.webp"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "140%",
              height: "160%",
              left: "-25%",
              top: "-20%",
              objectFit: "fill",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 0,
            }}
          />
          <p
            style={{
              position: "relative",
              zIndex: 1,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(0.82rem, 1.3vw, 0.95rem)",
              fontWeight: 400,
              color: "#1a1a1a",
              lineHeight: 1.85,
              margin: 0,
              padding: "1rem 1.3rem",
            }}
          >
            Bayi yang lahir di{" "}
            <strong style={{ fontWeight: 700 }}>Sulawesi Barat</strong> pada
            tahun 2024 hanya memiliki{" "}
            <strong style={{ fontWeight: 700 }}>harapan hidup</strong> hingga{" "}
            <span
              style={{
                fontWeight: 700,
                color: "#c0392b",
                background: "rgba(219,96,88,0.13)",
                borderRadius: 5,
                padding: "1px 5px",
                border: "1.2px solid rgba(219,96,88,0.38)",
              }}
            >
              71,03 tahun
            </span>{" "}
            — terpaut hampir tiga tahun di bawah rata-rata nasional. Angka ini
            bukan takdir. Ini adalah cerminan sebuah sistem yang belum bekerja.
          </p>
        </motion.div>

        {/* ── Stat boxes ── */}
        <motion.div
          {...fade(0.62)}
          style={{
            display: "flex",
            gap: "0.8rem",
            marginTop: "2rem",
            flexWrap: "wrap",
            alignItems: "stretch",
          }}
        >
          <StatBox
            bgSrc="/images/box1.webp"
            label="AHH SULBAR 2024"
            value="71,03"
            valueColor="#0C2726"
          />
          <StatBox
            bgSrc="/images/box1.webp"
            label="RATA-RATA NASIONAL"
            value="74,15"
            valueColor="#0C2726"
          />
          <StatBox
            bgSrc="/images/box2.webp"
            label="SELISIH"
            value="3,12"
            valueColor="#DB6058"
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────── */
/* Stat Box component                  */
/* ─────────────────────────────────── */
interface StatBoxProps {
  bgSrc: string;
  label: string;
  value: string;
  valueColor: string;
}

function StatBox({ bgSrc, label, value, valueColor }: StatBoxProps) {
  return (
    <div
      style={{
        position: "relative",
        minWidth: 118,
        borderRadius: 12,
        overflow: "hidden",
        padding: "11px 15px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Background image (box1 or box2) */}
      <img
        src={bgSrc}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* Label */}
      <span
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 9.5,
          fontWeight: 700,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          color: "#2a3a3a",
        }}
      >
        {label}
      </span>

      {/* Value + unit */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "baseline",
          gap: 5,
          marginTop: 1,
        }}
      >
        <span
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.65rem, 2.8vw, 2.1rem)",
            color: valueColor,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: 10,
            color: "#445",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          TAHUN
        </span>
      </div>
    </div>
  );
}
