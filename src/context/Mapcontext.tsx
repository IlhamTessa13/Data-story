import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface MapContextValue {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  mapReady: boolean;
  globeMode: boolean;
  setGlobeMode: (v: boolean) => void;
  stopGlobeRotation: () => void;
  startGlobeRotation: () => void;
  currentBearing: () => number;
  heroScrolling: boolean;
  setHeroScrolling: (v: boolean) => void;
}

const MapCtx = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rotateRef = useRef<number | null>(null);
  const bearingRef = useRef(0);

  const [mapReady, setMapReady] = useState(false);
  const [globeMode, setGlobeMode] = useState(true);
  const [heroScrolling, setHeroScrolling] = useState(false);

  const stopGlobeRotation = () => {
    if (rotateRef.current) {
      cancelAnimationFrame(rotateRef.current);
      rotateRef.current = null;
    }
  };

  const startGlobeRotation = () => {
    stopGlobeRotation();
    const tick = () => {
      if (!mapRef.current) return;
      bearingRef.current += 0.016;
      mapRef.current.setBearing(bearingRef.current % 360);
      rotateRef.current = requestAnimationFrame(tick);
    };
    rotateRef.current = requestAnimationFrame(tick);
  };

  const currentBearing = () => bearingRef.current;

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [119.4, -2.8],
      zoom: 1.8,
      pitch: 0,
      bearing: 0,
      projection: { name: "globe" } as unknown as mapboxgl.Projection,
      interactive: false,
    });

    mapRef.current.on("load", () => {
      const m = mapRef.current!;

      m.setFog({
        color: "rgb(240, 245, 255)",
        "high-color": "rgb(200, 220, 255)",
        "horizon-blend": 0.05,
        "space-color": "rgb(245, 248, 255)",
        "star-intensity": 0,
      });

      // ── highlight tertinggi / terendah ────────────────────────
      m.addSource("highlight-red", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      m.addSource("highlight-yellow", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      m.addLayer({
        id: "fill-red",
        type: "fill",
        source: "highlight-red",
        paint: { "fill-color": "#ef4444", "fill-opacity": 0.55 },
      });
      m.addLayer({
        id: "line-red",
        type: "line",
        source: "highlight-red",
        paint: { "line-color": "#b91c1c", "line-width": 2.5 },
      });
      m.addLayer({
        id: "fill-yellow",
        type: "fill",
        source: "highlight-yellow",
        paint: { "fill-color": "#f59e0b", "fill-opacity": 0.55 },
      });
      m.addLayer({
        id: "line-yellow",
        type: "line",
        source: "highlight-yellow",
        paint: { "line-color": "#b45309", "line-width": 2.5 },
      });

      // ── highlight clustering (hijau / kuning-emas / merah tua) ─
      m.addSource("cluster-1", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      m.addSource("cluster-2", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      m.addSource("cluster-3", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // Kluster 1 — Hijau (Akses Baik)
      m.addLayer({
        id: "fill-cluster-1",
        type: "fill",
        source: "cluster-1",
        paint: { "fill-color": "#22c55e", "fill-opacity": 0.55 },
      });
      m.addLayer({
        id: "line-cluster-1",
        type: "line",
        source: "cluster-1",
        paint: { "line-color": "#15803d", "line-width": 2.5 },
      });

      // Kluster 2 — Kuning (Akses Sedang)
      m.addLayer({
        id: "fill-cluster-2",
        type: "fill",
        source: "cluster-2",
        paint: { "fill-color": "#eab308", "fill-opacity": 0.55 },
      });
      m.addLayer({
        id: "line-cluster-2",
        type: "line",
        source: "cluster-2",
        paint: { "line-color": "#a16207", "line-width": 2.5 },
      });

      // Kluster 3 — Merah (Akses Rendah)
      m.addLayer({
        id: "fill-cluster-3",
        type: "fill",
        source: "cluster-3",
        paint: { "fill-color": "#ef4444", "fill-opacity": 0.6 },
      });
      m.addLayer({
        id: "line-cluster-3",
        type: "line",
        source: "cluster-3",
        paint: { "line-color": "#991b1b", "line-width": 2.5 },
      });

      startGlobeRotation();
      setMapReady(true);
    });

    return () => {
      stopGlobeRotation();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MapCtx.Provider
      value={{
        mapRef,
        mapReady,
        globeMode,
        setGlobeMode,
        stopGlobeRotation,
        startGlobeRotation,
        currentBearing,
        heroScrolling,
        setHeroScrolling,
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          background: "#f5f8ff",
        }}
      />
      {children}
    </MapCtx.Provider>
  );
}

export function useMap() {
  const ctx = useContext(MapCtx);
  if (!ctx) throw new Error("useMap must be used inside <MapProvider>");
  return ctx;
}
