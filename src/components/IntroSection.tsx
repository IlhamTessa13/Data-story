import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SlideData {
  id: string;
  label: string;
  title: string;
  value: string;
  valueNote: string;
  description: string;
  imageSrc: string;
  imageType: "illustration" | "photo"; // illustration = no-bg webp, photo = real photo
  layout: "image-right" | "image-left";
  accent: string;
  accentLight: string;
}

const SLIDES: SlideData[] = [
  {
    id: "makanan",
    label: "Pengeluaran Pangan",
    title: "Pengeluaran Per Kapita Per Bulan untuk Makanan",
    value: "Rp 548.000",
    valueNote: "rata-rata NTT, 2023",
    description:
      "Lebih dari separuh pengeluaran rumah tangga di NTT dialokasikan untuk makanan. Angka ini mencerminkan tekanan ekonomi yang tinggi — ketika daya beli rendah, kualitas gizi yang dikonsumsi ikut terdampak. Kabupaten dengan pengeluaran tertinggi mencapai Rp645.882, sementara yang terendah hanya Rp450.209 per kapita per bulan.",
    imageSrc: "/images/makanan.webp",
    imageType: "illustration",
    layout: "image-right",
    accent: "#7c3aed",
    accentLight: "#ede9fe",
  },
  {
    id: "protein",
    label: "Konsumsi Protein",
    title: "Rata-rata Konsumsi Protein Per Kapita Per Hari",
    value: "54,7 g",
    valueNote: "rata-rata NTT, 2023",
    description:
      "Angka Kecukupan Gizi protein yang dianjurkan adalah 57–62 g per hari. Di NTT, banyak kabupaten belum mencapai standar ini — Rote Ndao hanya 44,73 g/hari. Kekurangan protein kronis pada anak di bawah dua tahun menjadi salah satu pemicu utama stunting yang sulit dipulihkan.",
    imageSrc: "/images/protein.webp",
    imageType: "illustration",
    layout: "image-left",
    accent: "#0891b2",
    accentLight: "#e0f2fe",
  },
  {
    id: "stunting",
    label: "Stunting",
    title: "Prevalensi Stunting pada Anak Balita",
    value: "22,4%",
    valueNote: "rata-rata NTT, 2023",
    description:
      "Satu dari empat anak balita di NTT mengalami stunting — kondisi gagal tumbuh akibat kekurangan gizi kronis. Sumba Barat Daya mencatat angka tertinggi sebesar 39,2%, hampir lima kali lipat dari Lembata yang terendah (7,9%). Stunting bukan hanya soal tinggi badan; dampaknya meluas ke kemampuan kognitif dan produktivitas jangka panjang.",
    imageSrc: "/images/stunting.webp",
    imageType: "photo",
    layout: "image-right",
    accent: "#dc2626",
    accentLight: "#fee2e2",
  },
];

export default function IntroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Progress 0→1 dalam section ini
      const scrolled = -rect.top;
      const total = sectionRef.current.offsetHeight - vh;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      setScrollProgress(progress);

      // Tentukan slide aktif
      const idx = Math.min(
        SLIDES.length - 1,
        Math.floor(progress * SLIDES.length),
      );
      setActiveSlide(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const slide = SLIDES[activeSlide];
  const isRight = slide.layout === "image-right";

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        height: `${SLIDES.length * 100 + 100}vh`,
        zIndex: 5,
      }}
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "white",
        }}
      >
        {/* Progress bar atas */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "#f1f5f9",
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: "100%",
              background: slide.accent,
              width: `${scrollProgress * 100}%`,
              transition: "width 0.1s linear, background 0.5s ease",
            }}
          />
        </div>

        {/* Nav dots */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          {SLIDES.map((s, i) => (
            <div
              key={s.id}
              style={{
                height: 6,
                borderRadius: 3,
                background: i === activeSlide ? slide.accent : "#e2e8f0",
                width: i === activeSlide ? 24 : 6,
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Label kategori */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + "-label"}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35 }}
            style={{
              position: "absolute",
              top: 20,
              right: 32,
              zIndex: 10,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: slide.accent,
              background: slide.accentLight,
              padding: "4px 12px",
              borderRadius: 20,
            }}
          >
            {activeSlide + 1} / {SLIDES.length} · {slide.label}
          </motion.div>
        </AnimatePresence>

        {/* Main content grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            height: "100%",
            alignItems: "center",
            padding: "60px 0 32px",
          }}
        >
          <AnimatePresence mode="wait">
            {isRight ? (
              // Layout: teks kiri, gambar kanan
              <>
                <motion.div
                  key={slide.id + "-text-left"}
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 32 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ padding: "0 48px 0 64px" }}
                >
                  <TextContent slide={slide} />
                </motion.div>
                <motion.div
                  key={slide.id + "-img-right"}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ padding: "0 64px 0 16px" }}
                >
                  <ImageContent slide={slide} />
                </motion.div>
              </>
            ) : (
              // Layout: gambar kiri, teks kanan
              <>
                <motion.div
                  key={slide.id + "-img-left"}
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 32 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ padding: "0 16px 0 64px" }}
                >
                  <ImageContent slide={slide} />
                </motion.div>
                <motion.div
                  key={slide.id + "-text-right"}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ padding: "0 64px 0 48px" }}
                >
                  <TextContent slide={slide} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll hint bawah */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            opacity: 0.4,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 1,
              height: 28,
              background: "linear-gradient(to bottom, #64748b, transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function TextContent({ slide }: { slide: SlideData }) {
  return (
    <div>
      {/* Nilai utama */}
      <div
        style={{
          display: "inline-block",
          background: slide.accentLight,
          borderRadius: 12,
          padding: "12px 20px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800,
            color: slide.accent,
            lineHeight: 1,
          }}
        >
          {slide.value}
        </div>
        <div
          style={{
            fontSize: 11,
            color: slide.accent,
            opacity: 0.7,
            marginTop: 4,
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          {slide.valueNote}
        </div>
      </div>

      {/* Judul */}
      <h2
        style={{
          fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
          fontWeight: 700,
          color: "#0f172a",
          lineHeight: 1.35,
          marginBottom: 16,
          margin: "0 0 16px",
        }}
      >
        {slide.title}
      </h2>

      {/* Garis aksen */}
      <div
        style={{
          width: 40,
          height: 3,
          borderRadius: 2,
          background: slide.accent,
          marginBottom: 16,
        }}
      />

      {/* Deskripsi */}
      <p
        style={{
          fontSize: 14,
          color: "#475569",
          lineHeight: 1.8,
          margin: 0,
          maxWidth: 420,
        }}
      >
        {slide.description}
      </p>
    </div>
  );
}

function ImageContent({ slide }: { slide: SlideData }) {
  if (slide.imageType === "illustration") {
    // No-bg webp: tampilkan lebih besar, tanpa container
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <motion.img
          src={slide.imageSrc}
          alt={slide.label}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            maxHeight: "55vh",
            maxWidth: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.08))",
          }}
        />
      </div>
    );
  }

  // Real photo: dengan frame / rounded container
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.12)",
          maxHeight: "55vh",
          aspectRatio: "4/3",
        }}
      >
        <img
          src={slide.imageSrc}
          alt={slide.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
        {/* Overlay subtle gradient bawah untuk foto */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background:
              "linear-gradient(to top, rgba(220,38,38,0.15), transparent)",
          }}
        />
      </motion.div>
    </div>
  );
}
