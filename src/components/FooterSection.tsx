// src/components/FooterSection.tsx
import { useEffect } from "react";

const FooterSection = () => {
  // Pastikan globe (--map-fade-opacity) tidak tembus ke footer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          document.documentElement.style.setProperty("--map-fade-opacity", "0");
        }
      },
      { threshold: 0.1 },
    );
    const el = document.getElementById("footer-section");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      id="footer-section"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // Mulai dengan warna identik ShowSection, lalu drift ke nuansa footer
        background:
          "linear-gradient(to left, #d4f5ef 0%, #e8f8f5 40%, #c9f0e8 100%)",
        zIndex: 2,
        isolation: "isolate",
      }}
    >
      {/* Gradient jembatan dari ShowSection — hilangkan garis batas */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "28%",
          background:
            "linear-gradient(to bottom, #c9f0e8 0%, rgba(201,240,232,0) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Background image bgfooter.png — fade in dari tengah ke bawah */}
      <img
        src="/images/bgfooter.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.38,
          // Mask: transparan di atas, solid di bawah — melebur dengan ShowSection
          maskImage: "linear-gradient(to bottom, transparent 0%, black 35%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 35%)",
        }}
      />

      {/* Orang kiri — mhs4.png */}
      <img
        src="/images/mhsfooter.png"
        alt="Mahasiswa"
        style={{
          position: "absolute",
          bottom: 56, // atas strip bawah
          left: "clamp(0px, 2vw, 40px)",
          height: "clamp(320px, 72vh, 600px)",
          width: "auto",
          objectFit: "contain",
          objectPosition: "bottom left",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Orang kanan — mhs2.png */}
      <img
        src="/images/mhs2.png"
        alt="Mahasiswi"
        style={{
          position: "absolute",
          bottom: 56,
          right: "clamp(0px, 2vw, 40px)",
          height: "clamp(300px, 68vh, 560px)",
          width: "auto",
          objectFit: "contain",
          objectPosition: "bottom right",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Konten tengah */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 clamp(6rem, 22vw, 22rem)",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {/* Judul besar */}
        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            lineHeight: 1.2,
            color: "#DB6058",
            margin: "0 0 1.2rem",
            textAlign: "center",
          }}
        >
          Bukan Takdir.
          <br />
          Ini Sistem
          <br />
          <em style={{ fontStyle: "italic" }}>yang Bisa Dibenahi.</em>
        </h2>

        {/* Paragraf deskripsi */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(0.82rem, 1.3vw, 1rem)",
            fontWeight: 500,
            color: "#1a3a32",
            lineHeight: 1.85,
            margin: 0,
            textAlign: "center",
          }}
        >
          Angka harapan hidup Sulawesi Barat bukan hanya statistik, tetapi
          cerminan dari setiap faskes yang kekurangan tenaga medis, setiap warga
          tanpa BPJS, dan setiap kilometer yang memisahkan masyarakat dari
          layanan kesehatan.
        </p>
      </div>

      {/* Strip bawah — logo & info */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5,
          background: "rgba(180, 240, 220, 0.88)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          borderTop: "1.5px solid rgba(29,158,117,0.25)",
          padding: "clamp(0.6rem, 1.5vh, 1.2rem) clamp(1.5rem, 5vw, 4rem)",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Logo kiri — stis.webp */}
        <img
          src="/images/stis.webp"
          alt="Politeknik Statistika STIS"
          style={{
            height: "clamp(38px, 5vh, 54px)",
            width: "auto",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />

        {/* Logo — 3sd1.png */}
        <img
          src="/images/3sd1.png"
          alt="3SD1 Syndicate"
          style={{
            height: "clamp(38px, 5vh, 54px)",
            width: "auto",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />

        {/* Teks info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(0.75rem, 1.3vw, 0.95rem)",
              color: "#0C2726",
            }}
          >
            Kelompok 1 3SD1
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(0.62rem, 1vw, 0.8rem)",
              color: "#2a5a4a",
            }}
          >
            Politeknik Statistika STIS
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Sumber data kanan */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(0.6rem, 1vw, 0.78rem)",
              color: "#2a5a4a",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Sumber Data
          </span>
          <span
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(0.78rem, 1.3vw, 1rem)",
              color: "#DB6058",
            }}
          >
            BPS RI
          </span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
      `}</style>
    </footer>
  );
};

export default FooterSection;
