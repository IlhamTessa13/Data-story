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
        background: "transparent",
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

      {/* ── People illustration ── */}
      <img
        src="/images/people.webp"
        alt="Ilustrasi berbagai generasi"
        className="float-anim-slow"
        style={{
          position: "absolute",
          right: "0%",
          bottom: "20%",
          height: "59%",
          maxHeight: 720,
          width: "auto",
          objectFit: "contain",
          objectPosition: "bottom right",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 3,
          top: "30%",
        }}
      />

      {/* ── ornamen1 ── */}
      <img
        src="/images/ornamen1.webp"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
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
          paddingLeft: "clamp(2rem, 7vw, 8rem)",
          paddingRight: "2rem",
          paddingTop: "clamp(4rem, 8vh, 8rem)",
          paddingBottom: "clamp(3rem, 6vh, 6rem)",
          maxWidth: 760,
        }}
      >
        {/* ── Title ── */}
        <motion.h1 {...fade(0.2, 28)} style={{ margin: 0, lineHeight: 1.05 }}>
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
              whiteSpace: "nowrap",
            }}
          >
            Takdir Statistik
          </span>
        </motion.h1>

        {/* ── Description with ornamen3 + ornamen4 overlapping ── */}
        <motion.div
          {...fade(0.42)}
          style={{
            position: "relative",
            marginTop: "2rem",
            // maxWidth diperlebar agar teks jadi ~4 baris
            maxWidth: 600,
          }}
        >
          {/* ornamen3: warm blob — layer paling bawah, sisi kiri */}
          <img
            src="/images/ornamen3.webp"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "700%",
              height: "140%",
              left: "-14%",
              top: "-30%",
              objectFit: "fill",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 0,
            }}
          />

          {/* ornamen4: yellow rectangle — menutup seluruh area teks */}
          <img
            src="/images/ornamen4.webp"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              width: "100%",
              height: "108%",
              left: "-5%",
              top: "-4%",
              objectFit: "fill",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 1,
            }}
          />

          <p
            style={{
              position: "relative",
              zIndex: 2,
              fontFamily: "'Plus Jakarta Sans",
              // Perbesar sedikit font agar teks mengisi ~4 baris
              fontSize: "clamp(0.9rem, 1.45vw, 1.05rem)",
              fontWeight: 600,
              color: "#1a1a1a",
              lineHeight: 1.85,
              margin: 0,
              padding: "1.1rem 1.6rem",
              left: "-38px",
            }}
          >
            Bayi yang lahir di{" "}
            <strong style={{ fontWeight: 800 }}>Sulawesi Barat</strong> pada
            tahun 2024 hanya memiliki{" "}
            <strong style={{ fontWeight: 800 }}>harapan hidup</strong> hingga{" "}
            <span
              style={{
                fontWeight: 800,
                color: "#c0392b",
                background: "rgba(219,96,88,0.13)",
                borderRadius: 5,
                padding: "1px 5px",
                border: "1.2px solid rgba(219,96,88,0.38)",
              }}
            >
              66,27 tahun
            </span>{" "}
            , terpaut hampir delapan tahun di bawah rata-rata nasional. Angka ini
            bukan takdir. Ini adalah cerminan sebuah sistem yang belum bekerja.
          </p>
        </motion.div>

        {/* ── Stat boxes ── */}
        <motion.div
          {...fade(0.62)}
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "4rem",
            flexWrap: "nowrap",
            alignItems: "stretch",
            maxWidth: "100%",
            // Tambah padding atas agar box tidak terpotong di atas
            paddingTop: "4px",
            marginLeft: "-50px",
          }}
        >
          <StatBox
            bgSrc="/images/box1.webp"
            label="AHH SULBAR 2024"
            value="66,27"
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
            value="7,88"
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
        flex: "1 1 0",
        minWidth: 130,
        borderRadius: 12,
        overflow: "visible", // ← visible agar atas tidak terpotong
        padding: "25px 16px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // ← tengah horizontal
        gap: 1,
        top: "-20px",
      }}
    >
      {/* Background — clip sendiri agar border-radius tetap rapi */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <img
          src={bgSrc}
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      {/* Label — center, bold, nowrap */}
      <span
        style={{
          position: "relative",
          zIndex: 1,
          fontFamily: "'Plus Jakarta Sans'",
          fontSize: 12,
          fontWeight: "800",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#2a3a3a",
          whiteSpace: "nowrap",
          textAlign: "center",
          top: "-10px",
        }}
      >
        {label}
      </span>

      {/* Value + unit — center, nowrap */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 4,
          marginTop: 2,
          whiteSpace: "nowrap",
          top: "-10px",
        }}
      >
        <span
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
            color: valueColor,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800, // ← bold
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
