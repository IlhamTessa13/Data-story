import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { motion, AnimatePresence } from "framer-motion";
import { useMap } from "../context/Mapcontext";

const CENTROIDS: Record<string, [number, number]> = {
  Kupang: [123.8631, -9.9148],
  "Manggarai Barat": [120.0039, -8.6041],
  Nagekeo: [121.2715, -8.6902],
  "Kota Kupang": [123.6096, -10.2059],
  Malaka: [124.8886, -9.5264],
  "Sumba Barat": [119.3833, -9.6375],
  Lembata: [123.539, -8.3872],
  "Rote Ndao": [123.1294, -10.7252],
  Belu: [124.9687, -9.1555],
  Alor: [124.5803, -8.3027],
  "Timor Tengah Utara": [124.5718, -9.3764],
  Sikka: [122.3096, -8.6147],
  "Timor Tengah Selatan": [124.3962, -9.8292],
  Manggarai: [120.4029, -8.5673],
  "Sumba Barat Daya": [119.1792, -9.5341],
  "Manggarai Timur": [120.6897, -8.5739],
  Ngada: [121.0007, -8.6641],
  "Sabu Raijua": [121.8684, -10.5288],
  Ende: [121.7338, -8.6732],
  "Sumba Timur": [120.2544, -9.8767],
  "Sumba Tengah": [119.6683, -9.5444],
  "Flores Timur": [122.9456, -8.3619],
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
}

const STEPS: StepData[] = [
  {
    id: "protein",
    variableLabel: "Konsumsi Protein",
    unit: "g/kapita/hari",
    highest: { name: "Manggarai", value: 64.1 },
    lowest: { name: "Rote Ndao", value: 44.73 },
    narrative:
      "Konsumsi protein per kapita di NTT sangat bervariasi. Manggarai mencatat tertinggi (64,1 g/hari) sementara Rote Ndao terendah (44,73 g/hari). Rendahnya konsumsi protein berkorelasi kuat dengan tingginya angka stunting.",
    flyTo: { center: [121.5, -9.8], zoom: 6.8, bearing: -5, pitch: 38 },
  },
  {
    id: "pengeluaran",
    variableLabel: "Pengeluaran Makanan",
    unit: "Rp/kapita/bulan",
    highest: { name: "Ngada", value: 645882 },
    lowest: { name: "Alor", value: 450209 },
    narrative:
      "Pengeluaran untuk makanan mencerminkan daya beli masyarakat. Ngada memimpin dengan Rp645.882/bulan, sedangkan Alor hanya Rp450.209/bulan — selisih hampir Rp200 ribu yang berdampak signifikan pada kualitas gizi.",
    flyTo: { center: [122.5, -8.9], zoom: 7.0, bearing: 15, pitch: 45 },
  },
  {
    id: "stunting",
    variableLabel: "Persentase Stunting",
    unit: "%",
    highest: { name: "Sumba Barat Daya", value: 39.2 },
    lowest: { name: "Lembata", value: 7.9 },
    narrative:
      "Sumba Barat Daya mencatat angka stunting tertinggi di NTT — 39,2%, hampir 5× lipat dibanding Lembata yang terendah (7,9%). Kesenjangan ini menunjukkan perlunya intervensi yang ditargetkan per wilayah.",
    flyTo: { center: [121.5, -9.0], zoom: 6.9, bearing: 5, pitch: 42 },
  },
];

function fmtVal(v: number, unit: string) {
  if (unit.includes("Rp")) return `Rp${v.toLocaleString("id-ID")}`;
  if (unit === "%") return `${v}%`;
  return `${v} ${unit}`;
}

function injectPopupStyles() {
  if (document.getElementById("ntt-popup-styles")) return;
  const s = document.createElement("style");
  s.id = "ntt-popup-styles";
  s.textContent = `
    .ntt-popup .mapboxgl-popup-content { padding:0!important;background:transparent!important;border-radius:0!important;box-shadow:none!important; }
    .ntt-popup .mapboxgl-popup-tip { display:none!important; }
    .ntt-popup { z-index:40!important; }
  `;
  document.head.appendChild(s);
}

function buildPopupHTML(type: "highest" | "lowest", step: StepData) {
  const isH = type === "highest";
  const item = isH ? step.highest : step.lowest;
  const col = isH ? "#ef4444" : "#f59e0b";
  const bg = isH ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)";
  const lbl = isH ? "▲ TERTINGGI" : "▼ TERENDAH";
  const isRp = step.unit.includes("Rp");
  return `
<div style="width:210px;background:rgba(255,255,255,0.97);border-radius:14px;border:1px solid ${col}33;
  box-shadow:0 8px 32px rgba(0,0,0,0.1);overflow:hidden;font-family:system-ui,sans-serif;pointer-events:none;">
  <div style="height:3px;background:linear-gradient(90deg,${col},${col}44);"></div>
  <div style="padding:11px 14px 13px;">
    <div style="display:inline-flex;align-items:center;background:${bg};border:1px solid ${col}22;
      color:${col};font-size:9px;font-weight:800;letter-spacing:0.12em;padding:2px 8px;
      border-radius:20px;margin-bottom:7px;text-transform:uppercase;">${lbl}</div>
    <div style="font-size:10px;font-weight:600;color:rgba(0,0,0,0.4);
      text-transform:uppercase;letter-spacing:0.08em;margin-bottom:2px;">${step.variableLabel}</div>
    <div style="font-size:${isRp ? "19px" : "30px"};font-weight:800;color:${col};
      line-height:1.1;margin-bottom:7px;">${fmtVal(item.value, step.unit)}</div>
    <div style="display:flex;align-items:center;gap:5px;padding-top:7px;border-top:1px solid rgba(0,0,0,0.06);">
      <div style="width:6px;height:6px;border-radius:50%;background:${col};flex-shrink:0;"></div>
      <span style="font-size:12px;font-weight:700;color:#1e293b;">${item.name}</span>
    </div>
  </div>
</div>`;
}

function NarrativeBox({
  step,
  index,
  visible,
}: {
  step: StepData;
  index: number;
  visible: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 55,
            width: "min(560px,88vw)",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderRadius: 16,
            padding: "15px 22px 17px",
            border: "1px solid rgba(0,0,0,0.07)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 9,
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "#f97316",
                textTransform: "uppercase",
              }}
            >
              {index + 1} / {STEPS.length}
            </div>
            <div
              style={{ flex: 1, height: 1, background: "rgba(249,115,22,0.2)" }}
            />
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(0,0,0,0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {step.variableLabel}
            </div>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#334155",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {step.narrative}
          </p>
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
            background: i === current ? "#f97316" : "rgba(0,0,0,0.18)",
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
  const rotateRef = useRef<number | null>(null);
  const isFlying = useRef(false);
  const isZooming = useRef(false);
  const hasZoomedIn = useRef(false);
  const rotBearing = useRef(0);
  const lastStep = useRef(-1);
  const pendingZoom = useRef(false);
  const popupHighRef = useRef<mapboxgl.Popup | null>(null);
  const popupLowRef = useRef<mapboxgl.Popup | null>(null);
  const isResetting = useRef(false);

  const [activeStep, setActiveStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [uiVisible, setUiVisible] = useState(false);

  useEffect(() => {
    injectPopupStyles();
    fetch("/data/ntt-kabupaten.geojson")
      .then((r) => r.json())
      .then((d) => {
        geojsonRef.current = d;
        geojsonReady.current = true;
        if (pendingZoom.current && mapReady && !hasZoomedIn.current) {
          pendingZoom.current = false;
          triggerZoomIn(0);
        }
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removePopups = useCallback(() => {
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
    (
      mapRef.current.getSource("highlight-red") as mapboxgl.GeoJSONSource
    )?.setData(empty);
    (
      mapRef.current.getSource("highlight-yellow") as mapboxgl.GeoJSONSource
    )?.setData(empty);
  }, [mapRef]);

  const updateHighlight = useCallback(
    (highName: string, lowName: string) => {
      if (!mapRef.current || !geojsonRef.current) return;
      const get = (n: string) =>
        geojsonRef.current!.features.filter(
          (f) => (f.properties as { name: string }).name === n,
        );
      (
        mapRef.current.getSource("highlight-red") as mapboxgl.GeoJSONSource
      )?.setData({ type: "FeatureCollection", features: get(highName) });
      (
        mapRef.current.getSource("highlight-yellow") as mapboxgl.GeoJSONSource
      )?.setData({ type: "FeatureCollection", features: get(lowName) });
    },
    [mapRef],
  );

  const showPopups = useCallback(
    (step: StepData) => {
      if (!mapRef.current) return;
      removePopups();
      const hCoord = CENTROIDS[step.highest.name];
      const lCoord = CENTROIDS[step.lowest.name];
      if (!hCoord || !lCoord) return;
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
    },
    [mapRef, removePopups],
  );

  const stopSectionRotation = useCallback(() => {
    if (rotateRef.current) {
      cancelAnimationFrame(rotateRef.current);
      rotateRef.current = null;
    }
  }, []);

  const startSectionRotation = useCallback(
    (base: number) => {
      stopSectionRotation();
      rotBearing.current = base;
      const tick = () => {
        if (!mapRef.current) return;
        if (!isFlying.current) {
          rotBearing.current += 0.018;
          mapRef.current.setBearing(rotBearing.current % 360);
        }
        rotateRef.current = requestAnimationFrame(tick);
      };
      rotateRef.current = requestAnimationFrame(tick);
    },
    [mapRef, stopSectionRotation],
  );

  const resetToGlobe = useCallback(() => {
    if (!mapRef.current || isResetting.current) return;
    isResetting.current = true;
    stopSectionRotation();
    stopGlobeRotation();
    removePopups();
    clearHighlight();
    setUiVisible(false);
    setGlobeMode(true);
    setActiveStep(0);
    hasZoomedIn.current = false;
    isZooming.current = false;
    lastStep.current = -1;
    isFlying.current = false;
    mapRef.current.flyTo({
      center: [118.0, -2.0],
      zoom: 1.8,
      pitch: 0,
      bearing: currentBearing() % 360,
      duration: 1400,
      easing: (t) => t * (2 - t),
    });
    mapRef.current.once("moveend", () => {
      isResetting.current = false;
      startGlobeRotation();
    });
  }, [
    mapRef,
    stopSectionRotation,
    stopGlobeRotation,
    removePopups,
    clearHighlight,
    setGlobeMode,
    currentBearing,
    startGlobeRotation,
  ]);

  const triggerZoomIn = useCallback(
    (stepIdx: number) => {
      if (!mapRef.current || isZooming.current || hasZoomedIn.current) return;
      isZooming.current = true;
      isFlying.current = true;
      stopGlobeRotation();
      stopSectionRotation();
      clearHighlight();
      removePopups();
      const step = STEPS[stepIdx];
      mapRef.current.flyTo({
        center: step.flyTo.center,
        zoom: step.flyTo.zoom,
        bearing: step.flyTo.bearing,
        pitch: step.flyTo.pitch,
        duration: 3800,
        easing: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      });
      mapRef.current.once("moveend", () => {
        isFlying.current = false;
        hasZoomedIn.current = true;
        isZooming.current = false;
        lastStep.current = stepIdx;
        setGlobeMode(false);
        setTimeout(() => {
          updateHighlight(step.highest.name, step.lowest.name);
          showPopups(step);
          setUiVisible(true);
          startSectionRotation(step.flyTo.bearing);
        }, 300);
      });
    },
    [
      mapRef,
      stopGlobeRotation,
      stopSectionRotation,
      clearHighlight,
      removePopups,
      setGlobeMode,
      updateHighlight,
      showPopups,
      startSectionRotation,
    ],
  );

  const goToStep = useCallback(
    (idx: number) => {
      if (!mapRef.current || !mapReady) return;
      if (idx === lastStep.current && !isFlying.current) return;
      lastStep.current = idx;
      const step = STEPS[idx];
      isFlying.current = true;
      stopSectionRotation();
      updateHighlight(step.highest.name, step.lowest.name);
      showPopups(step);
      mapRef.current.flyTo({
        center: step.flyTo.center,
        zoom: step.flyTo.zoom,
        bearing: step.flyTo.bearing,
        pitch: step.flyTo.pitch,
        duration: 2200,
        easing: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      });
      mapRef.current.once("moveend", () => {
        isFlying.current = false;
        startSectionRotation(step.flyTo.bearing);
      });
    },
    [
      mapRef,
      mapReady,
      stopSectionRotation,
      updateHighlight,
      showPopups,
      startSectionRotation,
    ],
  );

  useEffect(() => {
    if (!visible) {
      removePopups();
      clearHighlight();
      setUiVisible(false);
    }
  }, [visible, removePopups, clearHighlight]);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const inView = rect.top < vh * 0.7 && rect.bottom > vh * 0.3;
      setVisible(inView);
      if (rect.top > vh * 0.4) {
        if (hasZoomedIn.current && !isResetting.current) resetToGlobe();
        return;
      }
      if (!inView) return;
      if (!hasZoomedIn.current) {
        if (mapReady && !isZooming.current && !heroScrolling) {
          if (geojsonReady.current) triggerZoomIn(0);
          else pendingZoom.current = true;
        }
        return;
      }
      const scrolled = -rect.top;
      const total = sectionRef.current.offsetHeight - vh;
      const progress = Math.max(0, Math.min(0.999, scrolled / total));
      const stepIdx = Math.min(
        STEPS.length - 1,
        Math.floor(progress * STEPS.length),
      );
      if (stepIdx !== activeStep) {
        setActiveStep(stepIdx);
        goToStep(stepIdx);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [
    activeStep,
    goToStep,
    mapReady,
    triggerZoomIn,
    resetToGlobe,
    heroScrolling,
  ]);

  useEffect(
    () => () => {
      removePopups();
      stopSectionRotation();
    },
    [removePopups, stopSectionRotation],
  );

  return (
    <>
      <ScrollHint visible={visible && globeMode && !heroScrolling} />
      {uiVisible && visible && !globeMode && (
        <>
          <NarrativeBox step={STEPS[activeStep]} index={activeStep} visible />
          <ProgressDots total={STEPS.length} current={activeStep} />
        </>
      )}
      <div
        ref={sectionRef}
        style={{
          position: "relative",
          height: `${(STEPS.length + 1.5) * 100}vh`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
