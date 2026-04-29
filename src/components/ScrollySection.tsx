import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { motion, AnimatePresence } from "framer-motion";
import { useMap } from "../context/Mapcontext";

const CENTROIDS: Record<string, [number, number]> = {
  MAMUJU: [119.1009, -2.6811],
  "POLEWALI MANDAR": [119.3527, -3.4138],
  MAJENE: [118.9688, -3.5402],
  PASANGKAYU: [119.4767, -1.8609],
  MAMASA: [119.3628, -3.0006],
  "MAMUJU TENGAH": [119.6082, -2.3941],
};

export const CLUSTER_MEMBERS: Record<1 | 2 | 3, string[]> = {
  1: ["MAMUJU", "POLEWALI MANDAR"],
  2: ["PASANGKAYU", "MAMASA"],
  3: ["MAMUJU TENGAH", "MAJENE"],
};

interface StepData {
  id: string;
  variableLabel: string;
  unit: string;
  highest: { name: string; value: number };
  lowest: { name: string; value: number };
  narrative: string;
  flyTo: {
    center: [number, number];
    zoom: number;
    bearing: number;
    pitch: number;
  };
  isClustering?: boolean;
}

const STEPS: StepData[] = [
  {
    id: "bpjs",
    variableLabel: "Cakupan BPJS",
    unit: "%",
    highest: { name: "MAMUJU", value: 92.66 },
    lowest: { name: "MAMUJU TENGAH", value: 75.43 },
    narrative:
      "Cakupan BPJS di Sulawesi Barat sangat bervariasi antar kabupaten. Mamuju mencatat tertinggi (92,66%) sementara Mamuju Tengah terendah (75,43%). Kesenjangan 17,23 poin ini mencerminkan ketimpangan akses layanan kesehatan yang perlu segera diatasi.",
    flyTo: { center: [119.3, -2.5], zoom: 8.2, bearing: -5, pitch: 38 },
  },
  {
    id: "tenaga-medis",
    variableLabel: "Tenaga Medis",
    unit: "orang",
    highest: { name: "POLEWALI MANDAR", value: 241 },
    lowest: { name: "MAMUJU TENGAH", value: 53 },
    narrative:
      "Distribusi tenaga medis di Sulbar tidak merata. Polewali Mandar memiliki tenaga medis terbanyak (241 orang), hampir 4,5 kali lipat dibanding Mamuju Tengah yang hanya 53 orang. Ketimpangan ini berdampak langsung pada kualitas layanan kesehatan di daerah terpencil.",
    flyTo: { center: [119.15, -2.85], zoom: 7.6, bearing: 10, pitch: 35 },
  },
  {
    id: "faskes",
    variableLabel: "Fasilitas Kesehatan",
    unit: "unit",
    highest: { name: "MAMUJU", value: 29 },
    lowest: { name: "MAMUJU TENGAH", value: 12 },
    narrative:
      "Mamuju memiliki fasilitas kesehatan terbanyak (29 unit) sebagai ibu kota provinsi, sementara Mamuju Tengah hanya memiliki 12 unit. Minimnya fasilitas di Mamuju Tengah berkorelasi dengan rendahnya cakupan BPJS dan jumlah tenaga medis di wilayah tersebut.",
    flyTo: { center: [119.35, -2.6], zoom: 8.0, bearing: 5, pitch: 40 },
  },
  {
    id: "clustering",
    variableLabel: "Kluster Akses Kesehatan",
    unit: "",
    highest: { name: "", value: 0 },
    lowest: { name: "", value: 0 },
    narrative:
      "Analisis kluster hierarkikal membagi 6 kabupaten Sulbar ke dalam 3 kelompok berdasarkan BPJS, tenaga medis, dan fasilitas kesehatan. Kluster Hijau (Baik) mencakup Mamuju, Polewali Mandar, dan Majene. Kluster Kuning (Sedang) meliputi Mamuju Utara dan Mamasa. Kluster Merah (Rendah) hanya diisi Mamuju Tengah — kabupaten ini secara konsisten berada di bawah rata-rata di semua indikator dan membutuhkan intervensi prioritas.",
    flyTo: { center: [119.2, -2.75], zoom: 7.8, bearing: 0, pitch: 36 },
    isClustering: true,
  },
];

const GLOBE_VIEW = {
  center: [119.4, -2.5] as [number, number],
  zoom: 1.8,
  pitch: 0,
  bearing: 0,
};

function injectPopupStyles() {
  if (document.getElementById("sulbar-popup-styles")) return;
  const s = document.createElement("style");
  s.id = "sulbar-popup-styles";
  s.textContent = `
    .ntt-popup .mapboxgl-popup-content { padding:0!important;background:transparent!important;border-radius:0!important;box-shadow:none!important; }
    .ntt-popup .mapboxgl-popup-tip { display:none!important; }
    .ntt-popup { z-index:40!important; }
  `;
  document.head.appendChild(s);
}

const POPUP_IMAGES: Record<string, { highest: string; lowest: string }> = {
  bpjs: {
    highest: "/images/tertinggi_bpjs.png",
    lowest: "/images/terendahbpjs.png",
  },
  "tenaga-medis": {
    highest: "/images/tertinggi_tenagamedis.png",
    lowest: "/images/terendah_tenagamedis.png",
  },
  faskes: {
    highest: "/images/tertinggi_fasilitas.png",
    lowest: "/images/terendah_fasilitas.png",
  },
};

function buildPopupHTML(type: "highest" | "lowest", step: StepData) {
  const src = POPUP_IMAGES[step.id]?.[type];
  if (!src) return "";
  return `<img src="${src}" style="width:220px;display:block;border-radius:16px;" />`;
}

const NARRATIVE_IMAGES: Record<string, string> = {
  bpjs: "/images/cakupanbpjs.png",
  "tenaga-medis": "/images/tenagamedis.png",
  faskes: "/images/fasilitaskesehatan.png",
  clustering: "/images/kluster.png",
};

function NarrativeBox({
  step,
  visible,
  direction,
  scrollProgress,
}: {
  step: StepData;
  index: number;
  visible: boolean;
  direction: number;
  scrollProgress: number;
}) {
  const src = NARRATIVE_IMAGES[step.id];
  if (!src) return null;
  const translateY = `${-130 * scrollProgress}%`;
  const opacity =
    scrollProgress < 0.7 ? 1 : Math.max(0, 1 - (scrollProgress - 0.7) / 0.3);
  return (
    <AnimatePresence mode="wait" custom={direction}>
      {visible && (
        <motion.div
          key={step.id}
          custom={direction}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity, y: 0 }}
          exit={{ opacity: 0, y: -60 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            bottom: 32,
            left: 32,
            zIndex: 55,
            width: "min(480px, 42vw)",
            transform: `translateY(${translateY})`,
            willChange: "transform, opacity",
          }}
        >
          <img
            src={src}
            alt={step.variableLabel}
            style={{ width: "100%", display: "block", borderRadius: 20 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 60,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 4,
            height: i === current ? 28 : 8,
            background: i === current ? "#0891b2" : "rgba(0,0,0,0.18)",
            transition: "height 0.3s ease, background 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 55,
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              color: "rgba(0,0,0,0.4)",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            ↓ &nbsp; scroll untuk menjelajah &nbsp; ↓
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ZoomOutOverlay({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 52,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            style={{
              fontFamily: "'Lora', serif",
              fontStyle: "italic",
              fontSize: "clamp(1rem, 2vw, 1.4rem)",
              color: "rgba(184,255,231,0.8)",
              letterSpacing: "0.05em",
              textAlign: "center",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ScrollySection() {
  const {
    mapRef,
    mapReady,
    globeMode,
    setGlobeMode,
    stopGlobeRotation,
    startGlobeRotation,
    currentBearing,
    heroScrolling,
  } = useMap();

  const geojsonRef = useRef<GeoJSON.FeatureCollection | null>(null);
  const geojsonReady = useRef(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const sectionRotateRef = useRef<number | null>(null);
  const rotBearing = useRef(0);

  const flyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const popupHighRef = useRef<mapboxgl.Popup | null>(null);
  const popupLowRef = useRef<mapboxgl.Popup | null>(null);

  const ticking = useRef(false);
  const lastScrollY = useRef(window.scrollY);
  const lastScrollTime = useRef(Date.now());
  const scrollSpeed = useRef(0);

  const mapStep = useRef(-1);

  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [visible, setVisible] = useState(false);
  const [uiVisible, setUiVisible] = useState(false);
  const [imageScrollProgress, setImageScrollProgress] = useState(0);
  const [showZoomOutOverlay, setShowZoomOutOverlay] = useState(false);

  const updateScrollSpeed = useCallback(() => {
    const now = Date.now();
    const dt = now - lastScrollTime.current;
    if (dt > 0)
      scrollSpeed.current = Math.abs(window.scrollY - lastScrollY.current) / dt;
    lastScrollY.current = window.scrollY;
    lastScrollTime.current = now;
  }, []);

  const getFlyDuration = useCallback((base: number) => {
    const s = scrollSpeed.current;
    if (s > 5) return Math.max(250, base * 0.15);
    if (s > 3) return Math.max(380, base * 0.25);
    if (s > 1.5) return Math.max(580, base * 0.42);
    if (s > 0.5) return Math.max(850, base * 0.62);
    return base;
  }, []);

  const stopSectionRotation = useCallback(() => {
    if (sectionRotateRef.current) {
      cancelAnimationFrame(sectionRotateRef.current);
      sectionRotateRef.current = null;
    }
  }, []);

  const startSectionRotation = useCallback(
    (baseBearing: number) => {
      stopSectionRotation();
      rotBearing.current = baseBearing;
      const tick = () => {
        if (!mapRef.current) return;
        rotBearing.current += 0.018;
        mapRef.current.setBearing(rotBearing.current % 360);
        sectionRotateRef.current = requestAnimationFrame(tick);
      };
      sectionRotateRef.current = requestAnimationFrame(tick);
    },
    [mapRef, stopSectionRotation],
  );

  const removeAllPopups = useCallback(() => {
    popupHighRef.current?.remove();
    popupHighRef.current = null;
    popupLowRef.current?.remove();
    popupLowRef.current = null;
  }, []);

  const clearHighlight = useCallback(() => {
    if (!mapRef.current) return;
    const empty: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [],
    };
    [
      "highlight-red",
      "highlight-yellow",
      "cluster-1",
      "cluster-2",
      "cluster-3",
    ].forEach((id) => {
      (mapRef.current!.getSource(id) as mapboxgl.GeoJSONSource)?.setData(empty);
    });
  }, [mapRef]);

  const applyStepVisuals = useCallback(
    (step: StepData) => {
      if (!mapRef.current || !geojsonRef.current) return;

      // Clear previous
      clearHighlight();
      removeAllPopups();

      if (step.isClustering) {
        const getF = (names: string[]) => ({
          type: "FeatureCollection" as const,
          features: geojsonRef.current!.features.filter((f) =>
            names.includes((f.properties as { name: string }).name),
          ),
        });
        (
          mapRef.current.getSource("cluster-1") as mapboxgl.GeoJSONSource
        )?.setData(getF(CLUSTER_MEMBERS[1]));
        (
          mapRef.current.getSource("cluster-2") as mapboxgl.GeoJSONSource
        )?.setData(getF(CLUSTER_MEMBERS[2]));
        (
          mapRef.current.getSource("cluster-3") as mapboxgl.GeoJSONSource
        )?.setData(getF(CLUSTER_MEMBERS[3]));
      } else {
        const get = (n: string) => ({
          type: "FeatureCollection" as const,
          features: geojsonRef.current!.features.filter(
            (f) => (f.properties as { name: string }).name === n,
          ),
        });
        (
          mapRef.current.getSource("highlight-red") as mapboxgl.GeoJSONSource
        )?.setData(get(step.highest.name));
        (
          mapRef.current.getSource("highlight-yellow") as mapboxgl.GeoJSONSource
        )?.setData(get(step.lowest.name));

        // Popups
        const hCoord = CENTROIDS[step.highest.name];
        const lCoord = CENTROIDS[step.lowest.name];
        if (hCoord) {
          popupHighRef.current = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            anchor: "bottom",
            offset: [0, -4],
            className: "ntt-popup",
            maxWidth: "none",
          })
            .setLngLat(hCoord)
            .setHTML(buildPopupHTML("highest", step))
            .addTo(mapRef.current);
        }
        if (lCoord) {
          popupLowRef.current = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            anchor: "bottom",
            offset: [0, -4],
            className: "ntt-popup",
            maxWidth: "none",
          })
            .setLngLat(lCoord)
            .setHTML(buildPopupHTML("lowest", step))
            .addTo(mapRef.current);
        }
      }
    },
    [mapRef, clearHighlight, removeAllPopups],
  );

  const doFlyTo = useCallback(
    (
      target: {
        center: [number, number];
        zoom: number;
        bearing: number;
        pitch: number;
      },
      baseDuration: number,
      onEnd?: () => void,
    ) => {
      if (!mapRef.current) return;

      mapRef.current.stop();
      stopSectionRotation();

      if (flyDebounceRef.current) clearTimeout(flyDebounceRef.current);

      const duration = getFlyDuration(baseDuration);
      const token = target; 

      flyDebounceRef.current = setTimeout(() => {
        if (!mapRef.current) return;
        mapRef.current.stop(); 

        mapRef.current.flyTo({
          center: token.center,
          zoom: token.zoom,
          bearing: token.bearing,
          pitch: token.pitch,
          duration,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });

        if (onEnd) {
          mapRef.current.once("moveend", () => {
            if (token === target) onEnd();
          });
        }
      }, 16);
    },
    [mapRef, stopSectionRotation, getFlyDuration],
  );

  const navigateTo = useCallback(
    (targetStep: number) => {
      if (!mapRef.current || !mapReady) return;
      if (targetStep === mapStep.current) return; 

      const prev = mapStep.current;
      mapStep.current = targetStep;

      setDirection(targetStep > prev ? 1 : -1);

      if (targetStep === -1) {
        stopGlobeRotation();
        clearHighlight();
        removeAllPopups();
        setUiVisible(false);
        setGlobeMode(true);

        doFlyTo(
          { ...GLOBE_VIEW, bearing: currentBearing() % 360 },
          2200,
          () => {
            if (mapStep.current !== -1) return;
            startGlobeRotation();
          },
        );
      } else {
        const step = STEPS[targetStep];
        stopGlobeRotation();
        setGlobeMode(false);
        setUiVisible(true);

        const baseDur = prev === -1 ? 3800 : 2000;

        doFlyTo(step.flyTo, baseDur, () => {
          if (mapStep.current !== targetStep) return;
          applyStepVisuals(step);
          startSectionRotation(step.flyTo.bearing);
        });
      }
    },
    [
      mapRef,
      mapReady,
      stopGlobeRotation,
      clearHighlight,
      removeAllPopups,
      setGlobeMode,
      currentBearing,
      startGlobeRotation,
      doFlyTo,
      applyStepVisuals,
      startSectionRotation,
    ],
  );

  useEffect(() => {
    injectPopupStyles();
    fetch("/data/sulbar-kabupaten.geojson")
      .then((r) => r.json())
      .then((d) => {
        geojsonRef.current = d;
        geojsonReady.current = true;
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const run = () => {
      updateScrollSpeed();
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const inView = rect.top < vh * 0.7 && rect.bottom > vh * 0.3;
      setVisible(inView);

      if (rect.top > vh * 0.35) {
        if (mapStep.current !== -1) {
          setImageScrollProgress(0);
          setShowZoomOutOverlay(false);
          navigateTo(-1);
        }
        return;
      }

      if (!inView || !mapReady || !geojsonReady.current || heroScrolling)
        return;

      const scrolled = Math.max(0, -rect.top);
      const totalH = sectionRef.current.offsetHeight - vh;
      const rawProgress = totalH > 0 ? scrolled / totalH : 0;

      if (rawProgress >= 1) {
        const lastIdx = STEPS.length - 1;
        if (activeStep !== lastIdx) setActiveStep(lastIdx);
        setImageScrollProgress(1);

        if (mapStep.current === lastIdx) {
          setShowZoomOutOverlay(true);
          setTimeout(() => setShowZoomOutOverlay(false), 1200);
          navigateTo(-1);
        }
        return;
      }

      const clampedP = Math.min(0.9999, rawProgress);
      const targetIdx = Math.min(
        STEPS.length - 1,
        Math.floor(clampedP * STEPS.length),
      );

      const perStep = 1 / STEPS.length;
      const localP = (clampedP % perStep) / perStep;
      setImageScrollProgress(Math.min(1, localP));

      if (targetIdx !== activeStep) {
        setActiveStep(targetIdx);
        setImageScrollProgress(0);
      }

      navigateTo(targetIdx);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        run();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    run(); 
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeStep, mapReady, heroScrolling, updateScrollSpeed, navigateTo]);

  useEffect(() => {
    if (visible && !globeMode) {
      document.documentElement.style.setProperty("--map-fade-opacity", "1");
    }
  }, [visible, globeMode]);

  useEffect(
    () => () => {
      removeAllPopups();
      stopSectionRotation();
    },
    [removeAllPopups, stopSectionRotation],
  );

  return (
    <>
      <ScrollHint visible={visible && globeMode && !heroScrolling} />
      <ZoomOutOverlay visible={showZoomOutOverlay} />

      {uiVisible && visible && !globeMode && (
        <>
          <NarrativeBox
            step={STEPS[activeStep]}
            index={activeStep}
            visible
            direction={direction}
            scrollProgress={imageScrollProgress}
          />
          <ProgressDots total={STEPS.length} current={activeStep} />
        </>
      )}

      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          height: `${(STEPS.length + 1.5) * 100}vh`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <div
          ref={sectionRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: `${(STEPS.length + 1.5) * 100}vh`,
            pointerEvents: "none",
          }}
        />
      </div>
    </>
  );
}
