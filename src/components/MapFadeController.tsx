import { useEffect } from "react";

function easeInOut(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

function setFade(v: number) {
  document.documentElement.style.setProperty(
    "--map-fade-opacity",
    String(Math.max(0, Math.min(1, v))),
  );
}

export default function MapFadeController() {
  useEffect(() => {
    let rafId: number | null = null;
    let scheduled = false;

    const compute = () => {
      scheduled = false;
      const vh = window.innerHeight;

      const lifeEl = document.getElementById("tren-ahh");
      const petaEl = document.getElementById("peta");
      const kesEl = document.getElementById("kesimpulan");

      if (!lifeEl || !petaEl || !kesEl) return;

      const lifeRect = lifeEl.getBoundingClientRect();
      const petaRect = petaEl.getBoundingClientRect();
      const kesRect = kesEl.getBoundingClientRect();

  
      const lifeBottom = lifeRect.bottom; 
      const lifeTop = lifeRect.top;
      const lifeH = lifeEl.offsetHeight;
      const lifeScrolled = -lifeTop;
      const lifeSectionH = lifeEl.querySelector("section")?.offsetHeight ?? vh;

      const lifeFadeStart = lifeSectionH * (1 / 3);
      const lifeFadeEnd = lifeSectionH * (1 / 3) + vh * 0.6;

      let lifeGlobeOpacity = 0;
      if (lifeScrolled > lifeFadeStart) {
        const rawT =
          (lifeScrolled - lifeFadeStart) / (lifeFadeEnd - lifeFadeStart);
        const t = Math.max(0, Math.min(1, rawT));
        const eased = easeInOut(t);
        const globeT = Math.max(0, (t - 0.2) / 0.8);
        lifeGlobeOpacity = easeInOut(Math.min(1, globeT));
      }

      const inLifeZone = lifeBottom > 0 && petaRect.top > vh * 0.4;

      const inScrollyZone = petaRect.top <= vh * 0.4 && kesRect.top > vh * 0.4;

      const kesFadeStart = vh * 0.85;
      const kesFadeEnd = vh * 0.05;
      let kesGlobeOpacity = 0;
      if (kesRect.top < kesFadeStart) {
        const rawT = (kesFadeStart - kesRect.top) / (kesFadeStart - kesFadeEnd);
        const t = Math.max(0, Math.min(1, rawT));
        kesGlobeOpacity = 1 - easeInOut(t);
      }

      if (kesRect.top < kesFadeStart) {
        setFade(kesGlobeOpacity);
      } else if (inScrollyZone) {
        setFade(1);
      } else if (inLifeZone) {
        setFade(lifeGlobeOpacity);
      } else {
        setFade(0);
      }
    };

    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    compute(); 

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null; 
}
