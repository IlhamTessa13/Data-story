import React from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

.nav-root { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }

/* ── Sticky outer: transparent, just floats the card ── */
.nav-outer {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  /* horizontal gap from edges — matches navigasi.png layout */
  padding: 8px 18px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  pointer-events: none;
  transition: padding 0.3s ease;
}
.nav-outer.scrolled { padding: 6px 18px; }

/* ── Nav card: rounded rectangle (not pill), fully transparent glass ── */
.nav-card {
  pointer-events: all;
  width: 100%;
  /* leaves breathing room — card never touches viewport edges */
  max-width: 1200px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  /* glass — shows whatever section is behind it */
  background: rgba(255, 255, 255, 0.28);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  /* smooth rounded corners — not pill, not sharp box */
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.55);

  padding: 8px 14px 8px 24px;
  box-shadow:
    0 4px 20px rgba(0, 60, 50, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.60);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.nav-card.scrolled {
  background: rgba(255, 255, 255, 0.42);
  box-shadow:
    0 6px 28px rgba(0, 60, 50, 0.14),
    inset 0 1px 0 rgba(255, 255, 255, 0.70);
}

/* ── Brand ── */
.nav-brand {
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: #002E32;
  white-space: nowrap;
  flex-shrink: 0;
  padding: 4px 0;
}

/* ── Desktop links ── */
.nav-links {
  display: none;
  align-items: center;
  gap: 2px;
}

/* ── Each link ── */
.nav-link {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #002E32;
  text-decoration: none;
  padding: 6px 15px;
  border-radius: 10px;
  white-space: nowrap;
  transition: background 0.18s ease, color 0.18s ease;
}
.nav-link:hover {
  background: rgba(255, 255, 255, 0.42);
  color: #001010;
}
.nav-link.active {
  font-weight: 800;
  color: #001010;
  background: rgba(255, 255, 255, 0.50);
  box-shadow: 0 1px 6px rgba(0, 46, 50, 0.08);
}

/* ── Hamburger (mobile) ── */
.nav-ham {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.36);
  border: 1px solid rgba(0, 46, 50, 0.13);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}
.nav-ham:hover { background: rgba(255, 255, 255, 0.58); }

/* ── Mobile dropdown ── */
.nav-mobile {
  position: fixed;
  top: 60px;
  left: 18px;
  right: 18px;
  z-index: 49;
  background: rgba(215, 248, 244, 0.97);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 8px 32px rgba(0, 60, 50, 0.13);
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.nav-mobile.open   { opacity: 1; transform: translateY(0);     pointer-events: all;  }
.nav-mobile.closed { opacity: 0; transform: translateY(-10px); pointer-events: none; }

.nav-mob-link {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #002E32;
  text-decoration: none;
  padding: 11px 18px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.28);
  transition: background 0.18s ease;
}
.nav-mob-link:hover  { background: rgba(255, 255, 255, 0.55); }
.nav-mob-link.active { background: rgba(255, 255, 255, 0.62); font-weight: 800; }

@media (min-width: 768px) {
  .nav-links { display: flex !important; }
  .nav-ham   { display: none  !important; }
}
`;

function useScrolled(threshold = 10) {
  const [s, setS] = React.useState(false);
  React.useEffect(() => {
    const h = () => setS(window.scrollY > threshold);
    window.addEventListener("scroll", h, { passive: true });
    h();
    return () => window.removeEventListener("scroll", h);
  }, [threshold]);
  return s;
}

const LINKS = [
  { label: "Latar Belakang", href: "#latar-belakang" },
  { label: "BPJS", href: "#bpjs" },
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "Tenaga Medis", href: "#tenaga-medis" },
  { label: "Tren AHH", href: "#tren-ahh" },
  { label: "Peta", href: "#peta" },
];

const Ham = ({ open }: { open: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    fill="none"
    stroke="#002E32"
    strokeWidth="2.2"
    strokeLinecap="round"
    style={{
      transform: open ? "rotate(-45deg)" : "none",
      transition: "transform 300ms",
    }}
  >
    <line
      x1="3"
      y1="5"
      x2="17"
      y2="5"
      style={{
        strokeDasharray: open ? "20 60" : "14 60",
        strokeDashoffset: open ? "-24px" : "0",
        transition: "all 300ms",
      }}
    />
    <line x1="3" y1="10" x2="17" y2="10" />
    <line
      x1="3"
      y1="15"
      x2="17"
      y2="15"
      style={{
        strokeDasharray: open ? "20 60" : "14 60",
        strokeDashoffset: open ? "-24px" : "0",
        transition: "all 300ms",
      }}
    />
  </svg>
);

export default function NavSection() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("#latar-belakang");
  const scrolled = useScrolled(10);

  React.useEffect(() => {
    const ids = LINKS.map((l) => l.href.replace("#", ""));
    const update = () => {
      let best = "",
        bestDist = Infinity;
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= window.innerHeight * 0.55 && r.bottom > 0) {
          const d = Math.abs(r.top);
          if (d < bestDist) {
            bestDist = d;
            best = id;
          }
        }
      });
      if (best) setActive(`#${best}`);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setActive(href);
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className={`nav-root nav-outer${scrolled ? " scrolled" : ""}`}>
        <nav className={`nav-card${scrolled ? " scrolled" : ""}`}>
          <span className="nav-brand">Kelompok 1 3SD1</span>

          <div className="nav-links">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`nav-link${active === l.href ? " active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.href);
                }}
              >
                {l.label}
              </a>
            ))}
          </div>

          <button
            className="nav-ham"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            <Ham open={open} />
          </button>
        </nav>
      </div>

      <div className={`nav-mobile${open ? " open" : " closed"}`} role="menu">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            role="menuitem"
            className={`nav-mob-link${active === l.href ? " active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              go(l.href);
            }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
