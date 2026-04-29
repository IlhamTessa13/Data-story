import { useEffect, useRef, useState } from "react";

export default function QuotesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.1 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        height: "clamp(320px, 55vh, 520px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "120px",
          left: "90px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 0,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}
      >
        <img
          src="/images/nakes.png"
          alt="Tenaga Kesehatan"
          className="float-anim-slow"
          style={{
            width: "170px",
            objectFit: "contain",
            objectPosition: "bottom center",
            display: "block",
          }}
        />
      </div>

      <img
        src="/images/ornamen9.png"
        alt=""
        aria-hidden
        className="float-anim-slow"
        style={{
          position: "absolute",
          top: "20%",
          left: "0px",
          transform: "translateY(-58%)",
          width: "clamp(150px, 20vw, 250px)",
          maxHeight: "100%",
          objectFit: "contain",
          objectPosition: "left center",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <img
        src="/images/ornamen8.png"
        alt=""
        aria-hidden
        className="float-anim"
        style={{
          position: "absolute",
          top: "21%",
          right: "0px",
          transform: "translateY(-58%)",
          width: "clamp(100px, 17vw, 210px)",
          maxHeight: "85%",
          objectFit: "contain",
          objectPosition: "right center",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <img
        src="/images/bunga4.png"
        alt=""
        aria-hidden
        className="float-spin"
        style={{
          display: "block",
          width: "clamp(65px, 8vw, 120px)",
          marginBottom: "clamp(0.6rem, 1.5vh, 1.2rem)",
          position: "relative",
          zIndex: 2,
          pointerEvents: "none",
          flexShrink: 0,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: "clamp(260px, 46vw, 560px)",
          textAlign: "center",
          padding: "0 clamp(1.5rem, 6vw, 3rem)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s",
          flexShrink: 0,
        }}
      >
        <blockquote
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: "italic",
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
            color: "#0C2726",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          "Dokter dan nakes adalah{" "}
          <span style={{ color: "#DB6058" }}>nyawa</span> dari sistem layanan
          kesehatan."
        </blockquote>
      </div>
    </section>
  );
}
