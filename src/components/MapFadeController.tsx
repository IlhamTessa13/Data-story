// src/components/MapFadeController.tsx
//
// SATU-SATUNYA komponen yang boleh menulis --map-fade-opacity.
// LifeExpectancySection, ScrollySection, ConclusionSection TIDAK boleh
// menyentuh variabel ini lagi.
//
// Logika per zona:
//
//  [LifeExpectancy]  fade-in globe saat user scroll ke bawah menuju tail-nya
//  [ScrollySection]  globe PENUH selama steps aktif (diatur ScrollySection via
//                    navigateTo — ia cukup set globeMode, controller yang
//                    mengurus opacity-nya di sini TIDAK — karena scrolly butuh
//                    kontrol instan; jadi kita biarkan scrolly zone = 1 selalu)
//  [Conclusion]      globe fade-out saat conclusion muncul
//
// Cara kerja:
//   Kita pasang satu scroll listener. Tiap frame kita ukur posisi
//   section-section kunci (via id) dan hitung opacity 0-1 secara ekslusif.

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

      // ── Apakah kita di zone LifeExpectancy (fade-in globe) ──────────────
      // LifeExpectancy wrapper punya tail zone 220vh setelah section itu
      // sendiri. Globe mulai muncul di 1/3 tinggi section + 0.6vh.
      // Kita replikasi kalkulasi yang sama persis dari LifeExpectancySection.
      const lifeBottom = lifeRect.bottom; // bawah wrapper (termasuk tail)
      const lifeTop = lifeRect.top;
      const lifeH = lifeEl.offsetHeight;

      // scrolled relatif ke atas wrapper
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
        // globe mulai muncul setelah 20% fade overlay
        const globeT = Math.max(0, (t - 0.2) / 0.8);
        lifeGlobeOpacity = easeInOut(Math.min(1, globeT));
      }

      // Apakah kita masih di zona LifeExpectancy (belum masuk peta)?
      const inLifeZone = lifeBottom > 0 && petaRect.top > vh * 0.4;

      // ── Apakah kita di zone ScrollySection ──────────────────────────────
      // Di zona scrolly, globe opacity diatur langsung oleh navigateTo()
      // di ScrollySection (via setGlobeMode). Controller ini tidak
      // mengganggu — kita set 1 saja agar ScrollySection bebas.
      const inScrollyZone = petaRect.top <= vh * 0.4 && kesRect.top > vh * 0.4;

      // ── Apakah kita di zone Conclusion (globe fade-out) ──────────────────
      // Globe fade dari 1 ke 0 saat conclusion muncul.
      // Fade mulai: kesRect.top = 85% vh → selesai: kesRect.top = 5% vh
      const kesFadeStart = vh * 0.85;
      const kesFadeEnd = vh * 0.05;
      let kesGlobeOpacity = 0;
      if (kesRect.top < kesFadeStart) {
        const rawT = (kesFadeStart - kesRect.top) / (kesFadeStart - kesFadeEnd);
        const t = Math.max(0, Math.min(1, rawT));
        // globe opacity = kebalikan dari conclusion opacity
        kesGlobeOpacity = 1 - easeInOut(t);
      }

      // ── Pilih nilai ──────────────────────────────────────────────────────
      if (kesRect.top < kesFadeStart) {
        // Conclusion zone: globe fade out
        setFade(kesGlobeOpacity);
      } else if (inScrollyZone) {
        // Scrolly zone: biarkan ScrollySection yang pegang via globeMode/CSS
        // Kita tidak override — set 1 agar peta visible, ScrollySection
        // yang atur visibilitas kontennya sendiri
        setFade(1);
      } else if (inLifeZone) {
        // LifeExpectancy zone: globe fade in dari bawah
        setFade(lifeGlobeOpacity);
      } else {
        // Di atas LifeExpectancy atau zone tidak dikenali: sembunyikan globe
        setFade(0);
      }
    };

    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    compute(); // initial

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null; // render nothing
}
