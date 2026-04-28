// src/components/ConclusionSection.tsx
import React, { useEffect, useRef, useState } from "react";

/** 5 belah ketupat outline saling overlapping — dekoratif */
const DiamondBg: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg
    width="500"
    height="520"
    viewBox="0 0 500 520"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
  >
    {[0, 1, 2, 3, 4].map((i) => {
      const cx = i * 100 + 50;
      return (
        <polygon
          key={i}
          points={`${cx},10 ${cx + 100},260 ${cx},510 ${cx - 100},260`}
          stroke="#e8a800"
          strokeWidth="1.5"
          fill="none"
          opacity="0.13"
        />
      );
    })}
  </svg>
);

// Mirror easing dari LifeExpectancySection
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const ConclusionSection: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0);

 useEffect(() => {
   const handleScroll = () => {
     if (!wrapperRef.current) return;

     const rect = wrapperRef.current.getBoundingClientRect();
     const vh = window.innerHeight;

     // ─── GUARD: hanya aktif jika section ini sudah mendekati viewport ───
     // Jika section masih jauh di bawah, jangan sentuh --map-fade-opacity
     if (rect.top > vh * 1.2) {
       return;
     }

     const fadeStart = vh;
     const fadeEnd = vh * 0.4;

     let t: number;
     if (rect.top >= fadeStart) {
       t = 0;
     } else if (rect.top <= fadeEnd) {
       t = 1;
     } else {
       t = (fadeStart - rect.top) / (fadeStart - fadeEnd);
     }

     const eased = easeInOut(t);
     setOverlayOpacity(eased);

     const globeT = Math.max(0, (t - 0.1) / 0.9);
     const globeEased = easeInOut(Math.min(1, globeT));
     document.documentElement.style.setProperty(
       "--map-fade-opacity",
       String(1 - globeEased),
     );
   };

   window.addEventListener("scroll", handleScroll, { passive: true });
   handleScroll();

   return () => {
     window.removeEventListener("scroll", handleScroll);
     document.documentElement.style.setProperty("--map-fade-opacity", "1");
   };
 }, []);
  return (
    <div ref={wrapperRef} style={{ position: "relative", zIndex: 1 }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          minHeight: "100vh",
          opacity: overlayOpacity,
          willChange: "opacity",
          isolation: "isolate",
          // Mask tepi atas agar fade masuk dari bawah tidak terpotong tajam
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 30%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 30%)",
        }}
      >
        <section
          style={{
            position: "relative",
            width: "100%",
            minHeight: "100vh",
            background:
              "linear-gradient(to top, #d4f5ef 0%, #e8f8f5 40%, #c9f0e8 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Poppins', sans-serif",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* ── Diamond BG KIRI ── */}
          <DiamondBg
            style={{
              position: "absolute",
              right: "calc(50% + 150px)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* ── Diamond BG KANAN ── */}
          <DiamondBg
            style={{
              position: "absolute",
              left: "calc(50% + 150px)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* ── Label KESIMPULAN ── */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "60px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              whiteSpace: "nowrap",
              zIndex: 5,
            }}
          >
            <span
              style={{
                display: "block",
                width: "40px",
                height: "2px",
                background: "#e8a800",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "4px",
                color: "#e8a800",
                textTransform: "uppercase",
              }}
            >
              Kesimpulan
            </span>
          </div>

          {/* ── Main content ── */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            <div style={{ width: "260px", flexShrink: 0 }} />

            {/* ── Card teks ── */}
            <div
              style={{ position: "relative", width: "560px", flexShrink: 0 }}
            >
              <img
                src="/images/ornamen13.png"
                alt=""
                style={{
                  position: "absolute",
                  top: "-62px",
                  left: "-62px",
                  width: "134px",
                  zIndex: 4,
                  pointerEvents: "none",
                }}
              />
              <img
                src="/images/ornamen14.png"
                alt=""
                style={{
                  position: "absolute",
                  bottom: "-56px",
                  right: "-56px",
                  width: "122px",
                  zIndex: 4,
                  pointerEvents: "none",
                }}
              />
              <img
                src="/images/conclusionbg.png"
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "fill",
                  zIndex: 0,
                  borderRadius: "8px",
                }}
              />
              <p
                style={{
                  position: "relative",
                  zIndex: 1,
                  fontSize: "14px",
                  lineHeight: 1.85,
                  color: "#2d2d2d",
                  textAlign: "center",
                  padding: "48px 50px",
                  margin: 0,
                }}
              >
                Angka Harapan Hidup (AHH) Sulawesi Barat yang masih berada di
                bawah rata-rata nasional merupakan cerminan dari ketimpangan
                akses ekonomi karena kurangnya kepesertaan BPJS, minimnya
                pemerataan fasilitas kesehatan, serta kurangnya tenaga medis
                profesional di daerah pelosok. Namun, realita ini bukanlah
                takdir statistik yang tidak dapat diubah. Dengan memperluas
                cakupan kepesertaan BPJS Kesehatan, membangun infrastruktur
                kesehatan perintis yang mampu menembus tantangan geografis,
                serta memberikan insentif bagi tenaga medis di daerah 3T,
                kesenjangan ini dapat diretas. Pada akhirnya, sinergi kebijakan
                yang tepat sasaran ini tidak hanya akan menghapus batasan akses
                layanan, tetapi juga menyambung harapan bagi setiap warga
                Sulawesi Barat untuk mendapatkan kualitas dan masa hidup yang
                lebih baik.
              </p>
            </div>

            {/* ── Karakter mhs ── */}
            <div
              style={{
                width: "260px",
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                height: "520px",
              }}
            >
              <img
                src="/images/mhs4.png"
                alt="mahasiswa"
                style={{
                  height: "100%",
                  maxHeight: "65vh",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ConclusionSection;
