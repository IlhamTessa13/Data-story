// src/App.tsx
import { useRef } from "react";
import { MapProvider } from "./context/Mapcontext";
import HeroSection from "./components/HeroSection";
import ScrollySection from "./components/ScrollySection";
import { storyConfig } from "./data/storyData";

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  return (
    <MapProvider>
      <div ref={mainRef} style={{ background: "#000", color: "white" }}>
        <HeroSection config={storyConfig} />
        <ScrollySection />
      </div>
    </MapProvider>
  );
}

export default App;
