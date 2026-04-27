// IntroSection.tsx
import { useEffect, useRef, useState } from "react";

export default function IntroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.06 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
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
        overflow: "hidden",
        padding:
          "clamp(3rem,7vh,5rem) clamp(1.5rem,6vw,7rem) clamp(6rem,12vh,10rem)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        minHeight: "130vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ══ ornamen5: daun kiri bawah ══ */}
      <img
        src="/images/ornamen5.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "0rem",
          left: "0rem",
          width: "clamp(300px, 35vw, 500px)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 2,
        }}
      />

      {/* ══ ornamen6: bunga kanan bawah ══ */}
      <img
        src="/images/ornamen6.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "0rem",
          right: "-1rem",
          width: "clamp(150x, 22vw, 260px)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 2,
        }}
      />

      {/* ══ ornamen10: kanan box deskripsi ══ */}
      <img
        src="/images/ornamen10.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "10%",
          right: "0rem",
          width: "clamp(80px, 10vw, 150px)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 3,
        }}
      />

      {/* ══ SECTION LABEL ══ */}
      <div
        style={{
          ...reveal(0.05),
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "2.5rem",
          position: "relative",
          zIndex: 10,
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
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#F1BD1E",
          }}
        >
          Latar Belakang
        </span>
      </div>

      {/* ══ MAIN GRID ══ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(2rem, 5vw, 5rem)",
          alignItems: "start",
          position: "relative",
          zIndex: 5,
          flex: 1,
        }}
      >
        {/* ════════ LEFT COLUMN ════════ */}
        <div style={{ position: "relative", minHeight: "500px" }}>
          {/* ── ornamen7: tangan — paling belakang ── */}
          <img
            src="/images/ornamen7.png"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-5%",
              left: "40%",
              width: "clamp(200px, 32vw, 420px)",
              pointerEvents: "none",
              userSelect: "none",
              opacity: 1,
              zIndex: 0,
            }}
          />

          {/* ── Headline + ornamen4 bg ── */}
          <div
            style={{
              ...reveal(0.1),
              position: "relative",
              marginBottom: "2rem",
              display: "inline-block",
              width: "100%",
              zIndex: 3,
            }}
          >
            <img
              src="/images/ornamen4.png"
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                width: "190%",
                height: "190%",
                objectFit: "fill",
                zIndex: 1,
                pointerEvents: "none",
                userSelect: "none",
                left: "-83px",
                top: "-70px",
                opacity: 0.7,
              }}
            />
            <h2
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 3.8vw, 3rem)",
                lineHeight: 1.12,
                margin: 0,
                position: "relative",
                zIndex: 2,
                padding: "0.8rem 1rem",
                left: "-25px",
                top: "27px",
              }}
            >
              <span style={{ color: "#DB6058", display: "block" }}>
                Krisis Kesehatan
              </span>
              <span
                style={{
                  fontFamily: "'Lora', serif",
                  fontStyle: "italic",
                  color: "#0C2726",
                  display: "block",
                }}
              >
                yang Tersembunyi
              </span>
            </h2>
          </div>

          {/* ── onamen8: absolute, bawah-tengah kolom kiri ── */}
          <div
            style={{
              ...reveal(0.3),
              position: "absolute",
              bottom: "-45%",
              left: "100%",
              transform: "translateX(-50%)",
              zIndex: 4,
              width: "146%",
            }}
          >
            <img
              src="/images/onamen8.png"
              alt="AHH Nasional 74,15 tahun — Sulbar hanya 71,03 tahun"
              style={{
                width: "100%",
                display: "block",
              }}
            />
          </div>
        </div>
        {/* ════════ RIGHT COLUMN ════════ */}
        <div style={{ position: "relative" }}>
          {/* bunga6 — tengah atas kotak */}
          <img
            src="/images/bunga6.png"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-1.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              width: "clamp(70px, 9vw, 120px)",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 6,
            }}
          />

          {/* Deskripsi box */}
          <div
            style={{
              ...reveal(0.18),
              background: "rgba(255, 248, 215, 0.75)",
              border: "1px solid rgba(219,188,100,0.4)",
              borderRadius: 18,
              padding: "clamp(1.4rem, 3vw, 2.2rem)",
              boxShadow: "0 4px 28px rgba(0,0,0,0.07)",
              position: "relative",
              zIndex: 5,
            }}
          >
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(0.82rem, 1.3vw, 0.97rem)",
                fontWeight: "600",
                lineHeight: 1.9,
                color: "#1e2d2c",
                margin: "0 0 1.1rem",
              }}
            >
              Angka Harapan Hidup (AHH) merupakan salah satu indikator utama
              dalam mengukur kualitas hidup dan pembangunan manusia. Indonesia
              mencatat peningkatan AHH secara nasional, namun{" "}
              <strong
                style={{
                  fontWeight: 800,
                  backgroundColor: "#e7f5ff",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                disparitas antar provinsi masih menjadi persoalan serius.
              </strong>
            </p>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(0.82rem, 1.3vw, 0.97rem)",
                fontWeight: "600",
                lineHeight: 1.9,
                color: "#1e2d2c",
                margin: "0 0 1.1rem",
              }}
            >
              <strong
                style={{
                  fontWeight: 800,
                  backgroundColor: "#EFB718",
                  padding: "2px 4px",
                  borderRadius: "4px",
                }}
              >
                Sulawesi Barat konsisten menempati posisi bawah
              </strong>{" "}
              dalam peringkat AHH nasional berdasarkan data BPS bersama Papua
              Pegunungan dan Papua Selatan. Kondisi ini mencerminkan kesenjangan
              struktural, keterbatasan BPJS, kurangnya tenaga medis, dan
              minimnya fasilitas kesehatan yang dapat dijangkau.
            </p>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "clamp(0.82rem, 1.3vw, 0.97rem)",
                fontWeight: "600",
                lineHeight: 1.9,
                color: "#1e2d2c",
                margin: 0,
              }}
            >
              Sebagai provinsi muda (berdiri 2004), Sulbar menghadapi tantangan
              ganda, membangun infrastruktur kesehatan dari awal sekaligus
              melayani populasi yang tersebar di wilayah dengan{" "}
              <strong style={{ fontWeight: 800 }}>
                geografis yang sulit dan berbukit.
              </strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
