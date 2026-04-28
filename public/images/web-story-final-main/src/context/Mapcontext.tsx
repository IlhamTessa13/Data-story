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

      // Fog warna disesuaikan dengan palet #effaf8 / #eef9f6
      // agar globe blend seamless dengan background LifeExpectancySection
      m.setFog({
        color: "rgb(8, 8, 24)", // gelap navy — horizon
        "high-color": "rgb(4, 4, 16)", // sangat gelap — upper atmosphere
        "horizon-blend": 0.06,
        "space-color": "rgb(2, 2, 10)", // hampir hitam — luar angkasa
        "star-intensity": 0.6, // bintang terlihat
      });

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
        paint: { "fill-color": "#FFEA4F", "fill-opacity": 1 },
      });
      m.addLayer({
        id: "line-red",
        type: "line",
        source: "highlight-red",
        paint: { "line-color": "#EFB718", "line-width": 2.5 },
      });
      m.addLayer({
        id: "fill-yellow",
        type: "fill",
        source: "highlight-yellow",
        paint: { "fill-color": "#FF9B4A", "fill-opacity": 1 },
      });
      m.addLayer({
        id: "line-yellow",
        type: "line",
        source: "highlight-yellow",
        paint: { "line-color": "#DB6058", "line-width": 2.5 },
      });

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
      m.addLayer({
        id: "fill-cluster-1",
        type: "fill",
        source: "cluster-1",
        paint: { "fill-color": "#3B82F6", "fill-opacity": 1 },
      });
      m.addLayer({
        id: "line-cluster-1",
        type: "line",
        source: "cluster-1",
        paint: { "line-color": "#1D4ED8", "line-width": 2.5 },
      });
      m.addLayer({
        id: "fill-cluster-2",
        type: "fill",
        source: "cluster-2",
        paint: { "fill-color": "#eab308", "fill-opacity": 1 },
      });
      m.addLayer({
        id: "line-cluster-2",
        type: "line",
        source: "cluster-2",
        paint: { "line-color": "#a16207", "line-width": 2.5 },
      });
      m.addLayer({
        id: "fill-cluster-3",
        type: "fill",
        source: "cluster-3",
        paint: { "fill-color": "#ef4444", "fill-opacity": 1 },
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
      {/*
       * Map container — opacity dikontrol LANGSUNG via CSS variable.
       *
       * TIDAK ada `transition` di sini karena LifeExpectancySection
       * sudah menghitung nilai opacity secara per-frame di scroll handler
       * (smooth via easing function). Menambahkan CSS transition di sini
       * akan double-ease dan membuat animasi terasa lambat/lag.
       *
       * Default opacity: 0 — LifeExpectancySection yang akan men-set
       * --map-fade-opacity ke nilai yang benar sesuai posisi scroll.
       * ScrollySection juga bisa override variable ini untuk fade-out
       * di tail zone-nya.
       */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          // Background gelap luar angkasa
          background: "rgb(2, 2, 10)",
          opacity:
            "var(--map-fade-opacity, 0)" as React.CSSProperties["opacity"],
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
