import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { motion, AnimatePresence } from "framer-motion";
import { useMap } from "../context/Mapcontext";

// Centroid tiap kabupaten (lng, lat)
const CENTROIDS: Record<string, [number, number]> = {
  MAMUJU: [119.1009, -2.6811],
  "POLEWALI MANDAR": [119.3527, -3.4138],
  MAJENE: [118.9688, -3.5402],
  "PASANGKAYU": [119.4767, -1.8609],
  MAMASA: [119.3628, -3.0006],
  "MAMUJU TENGAH": [119.6082, -2.3941],
};

// ── Clustering hierarkikal ─────────────────────────────────────
// Kluster 1 (Hijau  – Akses Baik)   : Mamuju, Polewali Mandar, Majene
// Kluster 2 (Kuning – Akses Sedang) : Mamuju Utara, Mamasa
// Kluster 3 (Merah  – Akses Rendah) : Mamuju Tengah
export const CLUSTER_MEMBERS: Record<1 | 2 | 3, string[]> = {
  1: ["MAMUJU", "POLEWALI MANDAR"],
  2: ["MAMUJU TENGAH", "MAJENE"],
  3: ["PASANGKAYU", "MAMASA"],
};

// Warna tiap kluster (isi & border)
const CLUSTER_COLORS: Record<
  1 | 2 | 3,
  { fill: string; border: string; text: string; bg: string }
> = {
  1: {
    fill: "#22c55e",
    border: "#15803d",
    text: "#15803d",
    bg: "rgba(34,197,94,0.12)",
  },
  2: {
    fill: "#eab308",
    border: "#a16207",
    text: "#a16207",
    bg: "rgba(234,179,8,0.12)",
  },
  3: {
    fill: "#ef4444",
    border: "#991b1b",
    text: "#991b1b",
    bg: "rgba(239,68,68,0.12)",
  },
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
  // step clustering tidak punya highest/lowest popup biasa
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
  // ── Step 4: Clustering Hierarkikal ──────────────────────────
  {
    id: "clustering",
    variableLabel: "Kluster Akses Kesehatan",
    unit: "",
    highest: { name: "", value: 0 }, // tidak dipakai
    lowest: { name: "", value: 0 }, // tidak dipakai
    narrative:
      "Analisis kluster hierarkikal membagi 6 kabupaten Sulbar ke dalam 3 kelompok berdasarkan BPJS, tenaga medis, dan fasilitas kesehatan. Kluster Hijau (Baik) mencakup Mamuju, Polewali Mandar, dan Majene. Kluster Kuning (Sedang) meliputi Mamuju Utara dan Mamasa. Kluster Merah (Rendah) hanya diisi Mamuju Tengah — kabupaten ini secara konsisten berada di bawah rata-rata di semua indikator dan membutuhkan intervensi prioritas.",
    flyTo: { center: [119.2, -2.75], zoom: 7.8, bearing: 0, pitch: 36 },
    isClustering: true,
  },
];

function fmtVal(v: number, unit: string) {
  if (unit === "%") return `${v}%`;
  if (unit === "orang") return `${v} orang`;
  if (unit === "unit") return `${v} unit`;
  return `${v} ${unit}`;
}

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

function buildPopupHTML(type: "highest" | "lowest", step: StepData) {
  const isH = type === "highest";
  const item = isH ? step.highest : step.lowest;
  const col = isH ? "#ef4444" : "#f59e0b";
  const bg = isH ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)";
  const lbl = isH ? "▲ TERTINGGI" : "▼ TERENDAH";
  const icon =
    step.id === "bpjs" ? "🏥" : step.id === "tenaga-medis" ? "👨‍⚕️" : "🏨";

  return `
<div style="width:220px;background:rgba(255,255,255,0.97);border-radius:14px;border:1px solid ${col}33;
  box-shadow:0 8px 32px rgba(0,0,0,0.1);overflow:hidden;font-family:system-ui,sans-serif;pointer-events:none;">
  <div style="height:3px;background:linear-gradient(90deg,${col},${col}44);"></div>
  <div style="padding:11px 14px 13px;">
    <div style="display:inline-flex;align-items:center;gap:5px;background:${bg};border:1px solid ${col}22;
      color:${col};font-size:9px;font-weight:800;letter-spacing:0.12em;padding:2px 8px;
      border-radius:20px;margin-bottom:8px;text-transform:uppercase;">${lbl}</div>
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
      <span style="font-size:16px;">${icon}</span>
      <div style="font-size:10px;font-weight:600;color:rgba(0,0,0,0.4);
        text-transform:uppercase;letter-spacing:0.08em;">${step.variableLabel}</div>
    </div>
    <div style="font-size:28px;font-weight:800;color:${col};line-height:1.1;margin-bottom:8px;">
      ${fmtVal(item.value, step.unit)}
    </div>
    <div style="display:flex;align-items:center;gap:5px;padding-top:7px;border-top:1px solid rgba(0,0,0,0.06);">
      <div style="width:6px;height:6px;border-radius:50%;background:${col};flex-shrink:0;"></div>
      <span style="font-size:12px;font-weight:700;color:#1e293b;">${item.name}</span>
    </div>
  </div>
</div>`;
}

// ── Popup kluster (mini badge per kabupaten) ───────────────────
function buildClusterPopupHTML(kabupaten: string, cluster: 1 | 2 | 3): string {
  const c = CLUSTER_COLORS[cluster];
  const labels: Record<1 | 2 | 3, string> = {
    1: "Kluster 1 · Akses Baik",
    2: "Kluster 2 · Akses Sedang",
    3: "Kluster 3 · Akses Rendah",
  };
  const icons: Record<1 | 2 | 3, string> = { 1: "✅", 2: "⚠️", 3: "🔴" };
  return `
<div style="width:180px;background:rgba(255,255,255,0.97);border-radius:12px;
  border:1px solid ${c.border}33;box-shadow:0 6px 24px rgba(0,0,0,0.10);
  overflow:hidden;font-family:system-ui,sans-serif;pointer-events:none;">
  <div style="height:3px;background:${c.fill};"></div>
  <div style="padding:9px 12px 11px;">
    <div style="display:inline-flex;align-items:center;gap:4px;background:${c.bg};
      border:1px solid ${c.border}22;color:${c.text};font-size:8.5px;font-weight:800;
      letter-spacing:0.12em;padding:2px 7px;border-radius:20px;margin-bottom:7px;
      text-transform:uppercase;">${icons[cluster]} ${labels[cluster]}</div>
    <div style="display:flex;align-items:center;gap:5px;">
      <div style="width:6px;height:6px;border-radius:50%;background:${c.fill};flex-shrink:0;"></div>
      <span style="font-size:12px;font-weight:700;color:#1e293b;">${kabupaten}</span>
    </div>
  </div>
</div>`;
}

// ── NarrativeBox ───────────────────────────────────────────────
function NarrativeBox({
  step,
  index,
  visible,
  direction,
}: {
  step: StepData;
  index: number;
  visible: boolean;
  direction: number;
}) {
  const icons = ["🏥", "👨‍⚕️", "🏨", "🔬"];
  return (
    <AnimatePresence mode="wait" custom={direction}>
      {visible && (
        <motion.div
          key={step.id}
          custom={direction}
          initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "fixed",
            bottom: 32,
            left: 32,
            zIndex: 55,
            width: "min(480px,42vw)",
            background: "rgba(255,255,255,0.96)",
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
            <span style={{ fontSize: 16 }}>{icons[index]}</span>
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "#0891b2",
                textTransform: "uppercase",
              }}
            >
              {index + 1} / {STEPS.length}
            </div>
            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(8,145,178,0.2)",
              }}
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

          {/* Legend khusus step clustering */}
          {step.isClustering && (
            <div
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: "1px solid rgba(0,0,0,0.07)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {(
                [
                  {
                    k: 1 as const,
                    label: "Kluster 1 — Akses Baik",
                    members: "Mamuju · Polewali Mandar · Majene",
                  },
                  {
                    k: 2 as const,
                    label: "Kluster 2 — Akses Sedang",
                    members: "Mamuju Utara · Mamasa",
                  },
                  {
                    k: 3 as const,
                    label: "Kluster 3 — Akses Rendah",
                    members: "Mamuju Tengah",
                  },
                ] as const
              ).map(({ k, label, members }) => (
                <div
                  key={k}
                  style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                >
                  <div
                    style={{
                      marginTop: 3,
                      width: 10,
                      height: 10,
                      borderRadius: 3,
                      background: CLUSTER_COLORS[k].fill,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: CLUSTER_COLORS[k].text,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(0,0,0,0.45)",
                        marginTop: 1,
                      }}
                    >
                      {members}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── ProgressDots ───────────────────────────────────────────────
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

// ── ScrollHint ─────────────────────────────────────────────────
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

// ── Main ───────────────────────────────────────────────────────
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
  // Popup kluster: satu per kabupaten (max 6)
  const clusterPopupsRef = useRef<mapboxgl.Popup[]>([]);
  const isResetting = useRef(false);
  const ticking = useRef(false);

  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [visible, setVisible] = useState(false);
  const [uiVisible, setUiVisible] = useState(false);

  useEffect(() => {
    injectPopupStyles();
    fetch("/data/sulbar-kabupaten.geojson")
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

  // ── Helper: hapus semua popup ──────────────────────────────
  const removePopups = useCallback(() => {
    popupHighRef.current?.remove();
    popupHighRef.current = null;
    popupLowRef.current?.remove();
    popupLowRef.current = null;
  }, []);

  const removeClusterPopups = useCallback(() => {
    clusterPopupsRef.current.forEach((p) => p.remove());
    clusterPopupsRef.current = [];
  }, []);

  const removeAllPopups = useCallback(() => {
    removePopups();
    removeClusterPopups();
  }, [removePopups, removeClusterPopups]);

  // ── Helper: reset semua highlight layer ───────────────────
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
    (mapRef.current.getSource("cluster-1") as mapboxgl.GeoJSONSource)?.setData(
      empty,
    );
    (mapRef.current.getSource("cluster-2") as mapboxgl.GeoJSONSource)?.setData(
      empty,
    );
    (mapRef.current.getSource("cluster-3") as mapboxgl.GeoJSONSource)?.setData(
      empty,
    );
  }, [mapRef]);

  // ── Highlight tertinggi / terendah ────────────────────────
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

  // ── Highlight clustering ───────────────────────────────────
  const updateClusterHighlight = useCallback(() => {
    if (!mapRef.current || !geojsonRef.current) return;

    const getFeatures = (names: string[]) =>
      geojsonRef.current!.features.filter((f) =>
        names.includes((f.properties as { name: string }).name),
      );

    (mapRef.current.getSource("cluster-1") as mapboxgl.GeoJSONSource)?.setData({
      type: "FeatureCollection",
      features: getFeatures(CLUSTER_MEMBERS[1]),
    });
    (mapRef.current.getSource("cluster-2") as mapboxgl.GeoJSONSource)?.setData({
      type: "FeatureCollection",
      features: getFeatures(CLUSTER_MEMBERS[2]),
    });
    (mapRef.current.getSource("cluster-3") as mapboxgl.GeoJSONSource)?.setData({
      type: "FeatureCollection",
      features: getFeatures(CLUSTER_MEMBERS[3]),
    });
  }, [mapRef]);

  // ── Popup clustering: satu popup per kabupaten ────────────
  const showClusterPopups = useCallback(() => {
    if (!mapRef.current) return;
    removeClusterPopups();

    ([1, 2, 3] as Array<1 | 2 | 3>).forEach((k) => {
      CLUSTER_MEMBERS[k].forEach((kabName) => {
        const coord = CENTROIDS[kabName];
        if (!coord) return;
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          anchor: "bottom",
          offset: [0, -4],
          className: "ntt-popup",
          maxWidth: "none",
        })
          .setLngLat(coord)
          .setHTML(buildClusterPopupHTML(kabName, k))
          .addTo(mapRef.current!);
        clusterPopupsRef.current.push(popup);
      });
    });
  }, [mapRef, removeClusterPopups]);

  // ── Popup tertinggi / terendah ────────────────────────────
  const showPopups = useCallback(
    (step: StepData) => {
      if (!mapRef.current || step.isClustering) return;
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

  // ── Rotasi section ────────────────────────────────────────
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

  // ── Reset ke globe ────────────────────────────────────────
  const resetToGlobe = useCallback(() => {
    if (!mapRef.current || isResetting.current) return;
    isResetting.current = true;
    stopSectionRotation();
    stopGlobeRotation();
    removeAllPopups();
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
    removeAllPopups,
    clearHighlight,
    setGlobeMode,
    currentBearing,
    startGlobeRotation,
  ]);

  // ── Zoom in awal ──────────────────────────────────────────
  const triggerZoomIn = useCallback(
    (stepIdx: number) => {
      if (!mapRef.current || isZooming.current || hasZoomedIn.current) return;
      isZooming.current = true;
      isFlying.current = true;
      stopGlobeRotation();
      stopSectionRotation();
      clearHighlight();
      removeAllPopups();

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
          if (!step.isClustering) {
            updateHighlight(step.highest.name, step.lowest.name);
            showPopups(step);
          }
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
      removeAllPopups,
      setGlobeMode,
      updateHighlight,
      showPopups,
      startSectionRotation,
    ],
  );

  // ── Navigasi antar step ───────────────────────────────────
  const goToStep = useCallback(
    (idx: number) => {
      if (!mapRef.current || !mapReady) return;
      if (idx === lastStep.current && !isFlying.current) return;

      const prevStep = lastStep.current;
      setDirection(idx > prevStep ? 1 : -1);
      lastStep.current = idx;

      const step = STEPS[idx];
      isFlying.current = true;
      stopSectionRotation();

      // Hapus semua popup & highlight sebelum ganti step
      removeAllPopups();
      clearHighlight();

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

        if (step.isClustering) {
          // ── Step clustering: tampilkan warna 3 kluster
          updateClusterHighlight();
          showClusterPopups();
        } else {
          // ── Step biasa: highlight tertinggi / terendah
          updateHighlight(step.highest.name, step.lowest.name);
          showPopups(step);
        }

        startSectionRotation(step.flyTo.bearing);
      });
    },
    [
      mapRef,
      mapReady,
      stopSectionRotation,
      removeAllPopups,
      clearHighlight,
      updateHighlight,
      showPopups,
      updateClusterHighlight,
      showClusterPopups,
      startSectionRotation,
    ],
  );

  useEffect(() => {
    if (!visible) {
      removeAllPopups();
      clearHighlight();
      setUiVisible(false);
    }
  }, [visible, removeAllPopups, clearHighlight]);

  useEffect(() => {
    const handleScrollLogic = () => {
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

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        handleScrollLogic();
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScrollLogic();
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
      removeAllPopups();
      stopSectionRotation();
    },
    [removeAllPopups, stopSectionRotation],
  );

  return (
    <>
      <ScrollHint visible={visible && globeMode && !heroScrolling} />

      {uiVisible && visible && !globeMode && (
        <>
          <NarrativeBox
            step={STEPS[activeStep]}
            index={activeStep}
            visible
            direction={direction}
          />
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
