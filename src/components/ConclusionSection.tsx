import { useEffect, useRef, useState } from "react";

const findings = [
  {
    icon: "🏥",
    label: "Cakupan BPJS",
    value: "17,23 poin",
    desc: "Kesenjangan antara Mamuju (92,66%) dan Mamuju Tengah (75,43%) — ketimpangan terbesar dalam akses jaminan kesehatan.",
    color: "#FF9B4A",
    border: "#DB6058",
  },
  {
    icon: "👨‍⚕️",
    label: "Tenaga Medis",
    value: "4,5× lipat",
    desc: "Polewali Mandar memiliki 241 tenaga medis, sementara Mamuju Tengah hanya 53 — distribusi yang sangat tidak merata.",
    color: "#2DD4BF",
    border: "#0C8C7C",
  },
  {
    icon: "🏨",
    label: "Fasilitas Kesehatan",
    value: "29 vs 12 unit",
    desc: "Mamuju sebagai ibu kota provinsi mendominasi jumlah fasilitas, meninggalkan Mamuju Tengah jauh tertinggal.",
    color: "#FFEA4F",
    border: "#EFB718",
  },
  {
    icon: "📊",
    label: "Angka Harapan Hidup",
    value: "64,37 – 68,27",
    desc: "AHH Sulbar masih di bawah rata-rata nasional, dengan perempuan secara konsisten lebih tinggi dari laki-laki.",
    color: "#A78BFA",
    border: "#7C3AED",
  },
];

const recommendations = [
  {
    no: "01",
    title: "Prioritaskan Mamuju Tengah",
    body: "Kabupaten ini secara konsisten berada di bawah rata-rata pada semua indikator. Diperlukan intervensi terpadu: penambahan tenaga medis, pembangunan puskesmas, dan perluasan kepesertaan BPJS.",
    color: "#ef4444",
  },
  {
    no: "02",
    title: "Redistribusi Tenaga Medis",
    body: "Insentif khusus bagi tenaga kesehatan yang bersedia bertugas di daerah terpencil perlu diperkuat melalui kebijakan afirmatif dan tunjangan daerah terpencil yang kompetitif.",
    color: "#eab308",
  },
  {
    no: "03",
    title: "Perkuat Sistem Rujukan",
    body: "Bangun jalur rujukan yang efisien antara kabupaten dengan fasilitas terbatas ke kabupaten yang lebih maju, didukung sistem transportasi kesehatan yang memadai.",
    color: "#3B82F6",
  },
  {
    no: "04",
    title: "Monitoring Berbasis Data",
    body: "Lakukan pemantauan indikator kesehatan secara berkala menggunakan dashboard terintegrasi, sehingga kebijakan dapat dievaluasi dan disesuaikan secara real-time.",
    color: "#2DD4BF",
  },
];

export default function ConclusionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cardVisible, setCardVisible] = useState<boolean[]>(
    new Array(findings.length).fill(false),
  );
  const [recVisible, setRecVisible] = useState<boolean[]>(
    new Array(recommendations.length).fill(false),
  );
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const recRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / (rect.height - vh)));
      setScrollProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = cardRefs.current.indexOf(e.target as HTMLDivElement);
          if (i !== -1 && e.isIntersecting) {
            setCardVisible((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.2 },
    );
    cardRefs.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const i = recRefs.current.indexOf(e.target as HTMLDivElement);
          if (i !== -1 && e.isIntersecting) {
            setRecVisible((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.15 },
    );
    recRefs.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        // ── Background diganti ke light green gradient (sama dengan LifeExpectancySection) ──
        background: "linear-gradient(to left, #B8FFE7 0%, #F5FFFE 100%)",
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      {/* ── Decorative background orbs ── */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "-8%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(12,39,38,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ══════════════════════════════════════
          HERO CONCLUSION
      ══════════════════════════════════════ */}
      <div
        style={{
          padding:
            "clamp(5rem,12vh,9rem) clamp(1.5rem,7vw,8rem) clamp(3rem,6vh,5rem)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Section label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "2rem",
            opacity: 0.9,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 28,
              height: 2,
              background: "#0C8C7C",
              borderRadius: 2,
            }}
          />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#0C8C7C",
            }}
          >
            Kesimpulan & Rekomendasi
          </span>
        </div>

        {/* Headline */}
        <div style={{ maxWidth: 780, marginBottom: "3rem" }}>
          <h2
            style={{
              margin: "0 0 1.2rem",
              lineHeight: 1.1,
            }}
          >
            <span
              style={{
                fontFamily: "'Lora', serif",
                fontStyle: "italic",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
                color: "#0C2726",
                display: "block",
              }}
            >
              Sulbar Butuh
            </span>
            <span
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
                color: "#DB6058",
                display: "block",
              }}
            >
              Aksi Nyata
            </span>
          </h2>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)",
              color: "#1a3a32",
              lineHeight: 1.9,
              margin: 0,
              maxWidth: 620,
            }}
          >
            Analisis data kesehatan Sulawesi Barat 2018–2024 mengungkap
            kesenjangan sistemik yang memerlukan intervensi terukur dan
            berkelanjutan. Ketimpangan antar kabupaten bukan sekadar angka — ia
            mencerminkan kehidupan nyata jutaan warga.
          </p>
        </div>

        {/* Stat highlight bar */}
        <div
          style={{
            display: "flex",
            gap: "1px",
            background: "rgba(12,140,124,0.12)",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(12,140,124,0.2)",
            marginBottom: "clamp(3rem,7vh,6rem)",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Kabupaten Dianalisis", val: "6" },
            { label: "Indikator Utama", val: "4" },
            { label: "Tahun Data", val: "2018–2024" },
            { label: "Kluster Hasil", val: "3" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                flex: "1 1 140px",
                padding: "1.4rem 2rem",
                background: "rgba(245,255,254,0.7)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                  color: "#0C8C7C",
                  lineHeight: 1,
                  marginBottom: "0.3rem",
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#64a89e",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          TEMUAN UTAMA
      ══════════════════════════════════════ */}
      <div
        style={{
          padding: "0 clamp(1.5rem,7vw,8rem) clamp(3rem,6vh,5rem)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(12,39,38,0.4)",
            }}
          >
            ── Temuan Utama
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
            marginBottom: "clamp(4rem,8vh,7rem)",
          }}
        >
          {findings.map((f, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{
                background: "rgba(255,255,255,0.6)",
                border: `1px solid ${f.border}33`,
                borderRadius: 20,
                padding: "1.6rem",
                opacity: cardVisible[i] ? 1 : 0,
                transform: cardVisible[i]
                  ? "translateY(0)"
                  : "translateY(40px)",
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
                position: "relative",
                overflow: "hidden",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Accent line top */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(to right, ${f.color}, ${f.border})`,
                  borderRadius: "20px 20px 0 0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.7rem",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: `${f.color}18`,
                    border: `1px solid ${f.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  {f.icon}
                </div>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    color: f.border,
                  }}
                >
                  {f.label}
                </span>
              </div>

              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                  color: "#0C2726",
                  lineHeight: 1.1,
                  marginBottom: "0.8rem",
                }}
              >
                {f.value}
              </div>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "0.8rem",
                  color: "#1a3a32",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          REKOMENDASI
      ══════════════════════════════════════ */}
      <div
        style={{
          padding: "0 clamp(1.5rem,7vw,8rem) clamp(4rem,8vh,7rem)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ marginBottom: "3rem" }}>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(12,39,38,0.4)",
              display: "block",
              marginBottom: "0.8rem",
            }}
          >
            ── Rekomendasi Kebijakan
          </span>
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)",
              color: "#0C2726",
              margin: 0,
            }}
          >
            Langkah Strategis ke Depan
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxWidth: 860,
          }}
        >
          {recommendations.map((r, i) => (
            <div
              key={i}
              ref={(el) => {
                recRefs.current[i] = el;
              }}
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "flex-start",
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(12,140,124,0.12)",
                borderRadius: 16,
                padding: "1.4rem 1.8rem",
                opacity: recVisible[i] ? 1 : 0,
                transform: recVisible[i]
                  ? "translateX(0)"
                  : "translateX(-40px)",
                transition: `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`,
                backdropFilter: "blur(8px)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontWeight: 900,
                  fontSize: "2rem",
                  color: r.color,
                  opacity: 0.4,
                  lineHeight: 1,
                  flexShrink: 0,
                  minWidth: 48,
                }}
              >
                {r.no}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: r.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Bricolage Grotesque', sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)",
                      color: "#0C2726",
                    }}
                  >
                    {r.title}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "0.82rem",
                    color: "#1a3a32",
                    lineHeight: 1.85,
                    margin: 0,
                  }}
                >
                  {r.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          PENUTUP / CLOSING STATEMENT
      ══════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(12,140,124,0.15)",
          padding: "clamp(3rem,6vh,5rem) clamp(1.5rem,7vw,8rem)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: "clamp(1rem, 2vw, 1.35rem)",
            color: "rgba(12,39,38,0.55)",
            maxWidth: 700,
            margin: "0 auto 1.5rem",
            lineHeight: 1.8,
          }}
        >
          "Data bukan sekadar angka — ia adalah cermin dari kehidupan nyata
          masyarakat Sulawesi Barat yang menunggu perubahan."
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <div
            style={{ width: 40, height: 1, background: "rgba(12,140,124,0.3)" }}
          />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "rgba(12,140,124,0.6)",
              textTransform: "uppercase",
            }}
          >
            Analisis Data Kesehatan Sulbar 2024
          </span>
          <div
            style={{ width: 40, height: 1, background: "rgba(12,140,124,0.3)" }}
          />
        </div>

        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "0.65rem",
            color: "rgba(12,39,38,0.3)",
            letterSpacing: "0.08em",
            margin: 0,
          }}
        >
          Sumber data: BPS Sulawesi Barat · Dinas Kesehatan Provinsi · BPJS
          Kesehatan · 2018–2024
        </p>
      </div>
    </section>
  );
}
