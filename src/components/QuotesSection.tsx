// QuotesSection.tsx
import { useEffect, useRef, useState } from "react";

export default function QuotesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        background: "#C5EDEA",
        padding: "clamp(3.5rem,9vh,7rem) clamp(1.5rem,7vw,8rem)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "40vh",
      }}
    >
      {/* ── ornamen9: bunga kiri ── */}
      <img
        src="/images/ornamen9.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "0%",
          transform: "translateY(-50%)",
          width: "clamp(150px, 20vw, 300px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── ornamen8: bunga kanan ── */}
      <img
        src="/images/ornamen8.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "53%",
          right: "0%",
          transform: "translateY(-50%)",
          width: "clamp(150px, 20vw, 300px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── bunga4: bunga tengah atas ── */}
      <img
        src="/images/bunga4.png"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "70px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "clamp(100px, 12vw, 180px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ── Quote content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: 380, // dipersempit agar teks jadi 3 baris
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0) scale(1)"
            : "translateY(30px) scale(0.97)",
          transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
          // beri jarak atas agar tidak ketutup bunga4
          paddingTop: "clamp(3rem, 5vw, 5rem)",
        }}
      >
        <blockquote
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            fontWeight: 800,
            fontSize: "clamp(1.9rem, 2.8vw, 2rem)",
            color: "#0C2726",
            lineHeight: 1.5,
            margin: "0 0 1.2rem",
          }}
        >
          "Dokter dan nakes adalah{" "}
          <span
            style={{
              color: "#DB6058",
              fontStyle: "italic",
            }}
          >
            nyawa
          </span>{" "}
          dari sistem layanan kesehatan."
        </blockquote>
      </div>
    </section>
  );
}
