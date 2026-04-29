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

      <img
        src="/images/people.webp"
        alt="Ilustrasi berbagai generasi"
        className="float-anim-slow hero-people-img"
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

        <motion.div
          {...fade(0.42)}
          style={{
            position: "relative",
            marginTop: "2rem",
            maxWidth: 600,
          }}
        >
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
            className="hero-desc-p"
            style={{
              position: "relative",
              zIndex: 2,
              fontFamily: "'Plus Jakarta Sans",
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
            , terpaut hampir delapan tahun di bawah rata-rata nasional. Angka
            ini bukan takdir. Ini adalah cerminan sebuah sistem yang belum
            bekerja.
          </p>
        </motion.div>

        <motion.div
          {...fade(0.62)}
          className="hero-stat-boxes"
          style={{
            display: "flex",
            gap: "0.5rem",
            marginTop: "4rem",
            flexWrap: "nowrap",
            alignItems: "stretch",
            maxWidth: "100%",
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
        overflow: "visible", 
        padding: "25px 16px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", 
        gap: 1,
        top: "-20px",
      }}
    >
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
            fontWeight: 800, 
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
