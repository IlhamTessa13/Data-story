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
  2: ["MAMUJU TENGAH", "MAJENE"],
  3: ["PASANGKAYU", "MAMASA"],
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
  const bgGrad = isH
    ? "linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B3A2A 100%)"
    : "linear-gradient(135deg, #7B6520 0%, #8B7530 50%, #7B5A20 100%)";
  const accentColor = isH ? "#E8A090" : "#E8C870";
  const badgeBg = isH ? "rgba(232,160,144,0.2)" : "rgba(232,200,112,0.2)";
  const badgeBorder = isH ? "#E8A090" : "#E8C870";
  const badgeText = isH ? "#F5C5B5" : "#F5E5A0";
  const triangle = isH ? "▲" : "▼";
  const lbl = isH ? "TERTINGGI" : "TERENDAH";
  const icon =
    step.id === "bpjs" ? "🏥" : step.id === "tenaga-medis" ? "👨‍⚕️" : "🏨";

  return `
<div style="width:220px;background:${bgGrad};border-radius:16px;
  border:1px solid ${accentColor}44;
  box-shadow:0 8px 32px rgba(0,0,0,0.35);overflow:hidden;
  font-family:'Plus Jakarta Sans',system-ui,sans-serif;">
  <div style="padding:14px 16px 16px;">
    <div style="display:inline-flex;align-items:center;gap:5px;
      background:${badgeBg};border:1px solid ${badgeBorder}66;
      color:${badgeText};font-size:9px;font-weight:800;letter-spacing:0.14em;
      padding:3px 10px;border-radius:20px;margin-bottom:12px;text-transform:uppercase;">
      ${triangle}&nbsp;&nbsp;${lbl}
    </div>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
      <div style="width:28px;height:28px;background:rgba(255,255,255,0.15);
        border-radius:8px;display:flex;align-items:center;justify-content:center;
        font-size:14px;flex-shrink:0;">${icon}</div>
      <div style="font-size:9.5px;font-weight:800;color:rgba(255,255,255,0.75);
        text-transform:uppercase;letter-spacing:0.1em;">${step.variableLabel}</div>
    </div>
    <div style="font-size:32px;font-weight:800;color:#FFFFFF;line-height:1;
      margin-bottom:12px;letter-spacing:-0.01em;">
      ${fmtVal(item.value, step.unit)}
    </div>
    <div style="display:inline-flex;align-items:center;gap:6px;
      background:${accentColor}25;border:1px solid ${accentColor}55;
      border-radius:8px;padding:5px 10px;">
      <div style="width:6px;height:6px;border-radius:50%;background:${accentColor};flex-shrink:0;"></div>
      <span style="font-size:11px;font-weight:700;color:#FFFFFF;">${item.name}</span>
    </div>
  </div>
</div>`;
}

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
            background: "linear-gradient(135deg, #1a4a4a 0%, #1e5a5a 100%)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            border: "1px solid rgba(93,212,200,0.3)",
            boxShadow: "0 12px 48px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 52px 10px 18px",
              background: "rgba(0,0,0,0.15)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              minHeight: 48,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#FFFFFF",
                borderRadius: 24,
                padding: "5px 14px 5px 8px",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.07)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                }}
              >
                {icons[index]}
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.13em",
                  color: "#0C2726",
                  textTransform: "uppercase",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {step.variableLabel}
              </span>
            </div>
            <div
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "#FFFFFF",
                borderRadius: 8,
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 700,
                color: "#0C2726",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "0.05em",
              }}
            >
              {index + 1}/{STEPS.length}
            </div>
          </div>

          <div style={{ padding: "14px 18px 16px" }}>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.85,
                margin: 0,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {step.narrative}
            </p>

            {step.isClustering && (
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {(
                  [
                    {
                      k: 1 as const,
                      label: "KLUSTER 1 — AKSES BAIK",
                      members: ["Mamuju", "Polewali Mandar", "Majene"],
                      color: "#3B82F6",
                      bg: "rgba(59,130,246,0.15)",
                      border: "rgba(59,130,246,0.35)",
                    },
                    {
                      k: 2 as const,
                      label: "KLUSTER 2 — AKSES SEDANG",
                      members: ["Mamuju Utara", "Mamasa"],
                      color: "#eab308",
                      bg: "rgba(234,179,8,0.15)",
                      border: "rgba(234,179,8,0.35)",
                    },
                    {
                      k: 3 as const,
                      label: "KLUSTER 3 — AKSES RENDAH",
                      members: ["Mamuju Tengah"],
                      color: "#ef4444",
                      bg: "rgba(239,68,68,0.15)",
                      border: "rgba(239,68,68,0.35)",
                    },
                  ] as const
                ).map(({ k, label, members, color, bg, border }) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: bg,
                        border: `1px solid ${border}`,
                        borderRadius: 6,
                        padding: "4px 9px",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 2,
                          background: color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 8.5,
                          fontWeight: 800,
                          color,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {label}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {members.map((m) => (
                        <span
                          key={m}
                          style={{
                            background: `${color}22`,
                            border: `1px solid ${color}44`,
                            borderRadius: 5,
                            padding: "2px 7px",
                            fontSize: 9,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.85)",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          >
            Melihat gambaran lebih besar...
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

  // sectionRef: zona steps scroll (sama seperti sebelumnya)
  const sectionRef = useRef<HTMLDivElement>(null);
  // wrapperRef: div panjang total termasuk tail globe-fade (seperti LifeExpectancySection)
  const wrapperRef = useRef<HTMLDivElement>(null);

  const rotateRef = useRef<number | null>(null);
  const flyAnimRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentFlyRef = useRef<{
    center: [number, number];
    zoom: number;
    bearing: number;
    pitch: number;
  } | null>(null);

  const isZooming = useRef(false);
  const hasZoomedIn = useRef(false);
  const rotBearing = useRef(0);
  const lastStep = useRef(-1);
  const pendingZoom = useRef(false);
  const popupHighRef = useRef<mapboxgl.Popup | null>(null);
  const popupLowRef = useRef<mapboxgl.Popup | null>(null);
  const clusterPopupsRef = useRef<mapboxgl.Popup[]>([]);
  const isResetting = useRef(false);
  const ticking = useRef(false);

  // Closing zoom-out (setelah kluster)
  const isZoomingOut = useRef(false);
  const hasZoomedOut = useRef(false);
  const [showZoomOutOverlay, setShowZoomOutOverlay] = useState(false);

  // Fade berbasis scroll — dipakai setelah globe muncul (tail zone)
  const [globeFadeOut, setGlobeFadeOut] = useState(1);

  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [visible, setVisible] = useState(false);
  const [uiVisible, setUiVisible] = useState(false);

  const scrollSpeedRef = useRef(0);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());

  const updateScrollSpeed = useCallback(() => {
    const now = Date.now();
    const dy = Math.abs(window.scrollY - lastScrollY.current);
    const dt = now - lastScrollTime.current;
    scrollSpeedRef.current = dt > 0 ? dy / dt : 0;
    lastScrollY.current = window.scrollY;
    lastScrollTime.current = now;
  }, []);

  const getFlyDuration = useCallback((base: number) => {
    const speed = scrollSpeedRef.current;
    if (speed > 3) return Math.max(400, base * 0.25);
    if (speed > 1.5) return Math.max(600, base * 0.45);
    if (speed > 0.5) return Math.max(900, base * 0.65);
    return base;
  }, []);

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

  const updateHighlight = useCallback(
    (highName: string, lowName: string) => {
      if (!mapRef.current || !geojsonRef.current) return;
      const get = (n: string) =>
        geojsonRef.current!.features.filter(
          (f) => (f.properties as { name: string }).name === n,
        );
      (
        mapRef.current.getSource("highlight-red") as mapboxgl.GeoJSONSource
      )?.setData({
        type: "FeatureCollection",
        features: get(highName),
      });
      (
        mapRef.current.getSource("highlight-yellow") as mapboxgl.GeoJSONSource
      )?.setData({
        type: "FeatureCollection",
        features: get(lowName),
      });
    },
    [mapRef],
  );

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
        rotBearing.current += 0.018;
        mapRef.current.setBearing(rotBearing.current % 360);
        rotateRef.current = requestAnimationFrame(tick);
      };
      rotateRef.current = requestAnimationFrame(tick);
    },
    [mapRef, stopSectionRotation],
  );

  const smoothFlyTo = useCallback(
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
      stopSectionRotation();
      mapRef.current.stop();
      if (flyAnimRef.current) clearTimeout(flyAnimRef.current);
      currentFlyRef.current = target;
      const duration = getFlyDuration(baseDuration);
      mapRef.current.flyTo({
        center: target.center,
        zoom: target.zoom,
        bearing: target.bearing,
        pitch: target.pitch,
        duration,
        easing: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
      });
      const handleMoveEnd = () => {
        if (currentFlyRef.current === target) onEnd?.();
      };
      mapRef.current.once("moveend", handleMoveEnd);
    },
    [mapRef, stopSectionRotation, getFlyDuration],
  );

  // ── Reset ke globe saat scroll ke atas (keluar section) ──
  const resetToGlobe = useCallback(() => {
    if (!mapRef.current || isResetting.current || isZoomingOut.current) return;
    isResetting.current = true;
    isZoomingOut.current = true;
    stopSectionRotation();
    stopGlobeRotation();
    removeAllPopups();
    clearHighlight();
    setUiVisible(false);
    setGlobeMode(true);
    setGlobeFadeOut(1);

    const dur = getFlyDuration(2200);
    mapRef.current.stop();
    mapRef.current.flyTo({
      center: [119.4, -2.5],
      zoom: 1.8,
      pitch: 0,
      bearing: currentBearing() % 360,
      duration: dur,
      easing: (t) => t * (2 - t),
    });

    mapRef.current.once("moveend", () => {
      isResetting.current = false;
      isZoomingOut.current = false;
      hasZoomedIn.current = false;
      hasZoomedOut.current = false;
      isZooming.current = false;
      lastStep.current = -1;
      setActiveStep(0);
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
    getFlyDuration,
  ]);

  // ── Closing zoom-out setelah step terakhir (kluster) ──
  // Globe muncil kecil, berputar, lalu fade saat scroll lanjut ke conclusion
  const triggerClosingZoomOut = useCallback(() => {
    if (!mapRef.current || isZoomingOut.current || hasZoomedOut.current) return;
    isZoomingOut.current = true;
    hasZoomedOut.current = true;

    stopSectionRotation();
    removeAllPopups();
    clearHighlight();
    setUiVisible(false);
    setShowZoomOutOverlay(true);

    const dur = getFlyDuration(2400);
    mapRef.current.stop();
    mapRef.current.flyTo({
      center: [119.4, -2.5],
      zoom: 1.8,
      pitch: 0,
      bearing: currentBearing() % 360,
      duration: dur,
      easing: (t) => t * (2 - t),
    });

    mapRef.current.once("moveend", () => {
      setShowZoomOutOverlay(false);
      isZoomingOut.current = false;
      setGlobeMode(true);
      // Globe berputar pelan saat user scroll menuju conclusion
      startGlobeRotation();
    });
  }, [
    mapRef,
    stopSectionRotation,
    removeAllPopups,
    clearHighlight,
    setGlobeMode,
    currentBearing,
    startGlobeRotation,
    getFlyDuration,
  ]);

  const triggerZoomIn = useCallback(
    (stepIdx: number) => {
      if (!mapRef.current || isZooming.current || hasZoomedIn.current) return;
      isZooming.current = true;
      stopGlobeRotation();
      clearHighlight();
      removeAllPopups();

      const step = STEPS[stepIdx];
      smoothFlyTo(step.flyTo, 3800, () => {
        hasZoomedIn.current = true;
        isZooming.current = false;
        lastStep.current = stepIdx;
        hasZoomedOut.current = false;
        setGlobeMode(false);
        setTimeout(() => {
          if (!step.isClustering) {
            updateHighlight(step.highest.name, step.lowest.name);
            showPopups(step);
          } else {
            updateClusterHighlight();
          }
          setUiVisible(true);
          startSectionRotation(step.flyTo.bearing);
        }, 200);
      });
    },
    [
      mapRef,
      stopGlobeRotation,
      clearHighlight,
      removeAllPopups,
      smoothFlyTo,
      setGlobeMode,
      updateHighlight,
      showPopups,
      updateClusterHighlight,
      startSectionRotation,
    ],
  );

  const goToStep = useCallback(
    (idx: number) => {
      if (!mapRef.current || !mapReady) return;
      if (idx === lastStep.current) return;

      const prevStep = lastStep.current;
      setDirection(idx > prevStep ? 1 : -1);
      lastStep.current = idx;

      const step = STEPS[idx];
      removeAllPopups();
      clearHighlight();

      // Jika kembali ke step dari zona tail, reset flag zoom-out
      hasZoomedOut.current = false;
      isZoomingOut.current = false;

      smoothFlyTo(step.flyTo, 2200, () => {
        if (lastStep.current !== idx) return;
        if (step.isClustering) {
          updateClusterHighlight();
        } else {
          updateHighlight(step.highest.name, step.lowest.name);
          showPopups(step);
        }
        startSectionRotation(step.flyTo.bearing);
      });
    },
    [
      mapRef,
      mapReady,
      removeAllPopups,
      clearHighlight,
      smoothFlyTo,
      updateHighlight,
      showPopups,
      updateClusterHighlight,
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

  // ── Fade-out scroll: berjalan di "tail" zone setelah globe muncul ──
  // Mirip LifeExpectancySection: fade terjadi saat user scroll dari zona globe ke conclusion
  useEffect(() => {
    const handleFadeScroll = () => {
      if (!wrapperRef.current) return;

      // Hanya aktif saat globe sudah zoom-out
      if (!hasZoomedOut.current) {
        setGlobeFadeOut(1);
        return;
      }

      const rect = wrapperRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const wrapperH = wrapperRef.current.offsetHeight;

      const scrolled = -rect.top; // berapa px sudah di-scroll dalam wrapper
      // Zona steps berakhir di (STEPS.length + 1.5) * vh
      const stepsZoneH = (STEPS.length + 1.5) * vh;
      // Tail zone: dari akhir steps sampai akhir wrapper
      // Fade mulai saat globe sudah keluar (sedikit setelah stepsZoneH)
      const fadeStart = stepsZoneH;
      const fadeEnd = wrapperH - vh * 0.8; // selesai fade sebelum conclusion muncul

      if (scrolled < fadeStart) {
        setGlobeFadeOut(1);
        return;
      }

      const raw = (scrolled - fadeStart) / (fadeEnd - fadeStart);
      const opacity = Math.max(0, Math.min(1, 1 - raw));
      setGlobeFadeOut(opacity);
    };

    window.addEventListener("scroll", handleFadeScroll, { passive: true });
    handleFadeScroll();
    return () => window.removeEventListener("scroll", handleFadeScroll);
  }, []);

  // ── Terapkan opacity ke elemen map container via CSS variable ──
  // MapContainer harus membaca var(--map-fade-opacity) dan terapkan ke wrapper-nya
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--map-fade-opacity",
      String(globeFadeOut),
    );
  }, [globeFadeOut]);

  // ── Main scroll logic ──
  useEffect(() => {
    const handleScrollLogic = () => {
      updateScrollSpeed();

      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const inView = rect.top < vh * 0.7 && rect.bottom > vh * 0.3;
      setVisible(inView);

      // Scroll ke atas → reset globe
      if (rect.top > vh * 0.4) {
        if (hasZoomedIn.current && !isResetting.current) resetToGlobe();
        return;
      }
      if (!inView) return;

      // Zoom in pertama kali
      if (!hasZoomedIn.current) {
        if (mapReady && !isZooming.current && !heroScrolling) {
          if (geojsonReady.current) triggerZoomIn(0);
          else pendingZoom.current = true;
        }
        return;
      }

      // Progress scroll → step
      const scrolled = -rect.top;
      const total = sectionRef.current.offsetHeight - vh;
      const rawProgress = Math.max(0, scrolled / total);

      // Melewati semua steps → trigger closing zoom-out ke globe
      if (rawProgress >= 1) {
        if (!hasZoomedOut.current && !isZoomingOut.current) {
          triggerClosingZoomOut();
        }
        // Tetap tampilkan step terakhir
        const lastStepIdx = STEPS.length - 1;
        if (activeStep !== lastStepIdx) setActiveStep(lastStepIdx);
        return;
      }

      const progress = Math.min(0.999, rawProgress);
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
    triggerClosingZoomOut,
    resetToGlobe,
    heroScrolling,
    updateScrollSpeed,
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
      <ZoomOutOverlay visible={showZoomOutOverlay} />

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

      {/*
        Struktur wrapper dua lapis (seperti LifeExpectancySection):
        - wrapperRef: div panjang total, mencakup steps + tail fade zone
        - sectionRef (di dalam): hanya zona steps, untuk logic scroll step

        Tail zone = extra 2.5 * 100vh setelah steps selesai
        Di zona ini globe berputar, lalu perlahan fade ke conclusion
      */}
      <div
        ref={wrapperRef}
        style={{
          position: "relative",
          // Steps zone + tail zone (globe putar + fade ke conclusion)
          height: `${(STEPS.length + 1.5 + 2.5) * 100}vh`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        {/* sectionRef: hanya zona steps untuk kalkulasi progress */}
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
