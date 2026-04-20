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
      // satellite-streets tetap support globe projection
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [118.0, -2.0],
      zoom: 1.8,
      pitch: 0,
      bearing: 0,
      projection: { name: "globe" } as unknown as mapboxgl.Projection,
      interactive: false,
    });

    mapRef.current.on("load", () => {
      const m = mapRef.current!;

      // Fog terang — space putih, globe tetap kelihatan
      m.setFog({
        color: "rgb(240, 245, 255)", // horizon putih kebiruan
        "high-color": "rgb(200, 220, 255)", // langit biru sangat muda
        "horizon-blend": 0.05,
        "space-color": "rgb(245, 248, 255)", // space putih — bukan hitam
        "star-intensity": 0, // matikan bintang
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
          background: "#f5f8ff", // fallback sebelum map load
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
