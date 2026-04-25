// src/App.tsx
import { useRef } from "react";
import { MapProvider } from "./context/Mapcontext";
import HeroSection from "./components/HeroSection";
import ScrollySection from "./components/ScrollySection";
import IntroSection from "./components/IntroSection";
import BpjsSection from "./components/BpjsSection";
import FacilitySection from "./components/FacilitySection";
import QuotesSection from "./components/QuotesSection";
import MedicalSection from "./components/MedicalSection";
import LifeExpectancySection from "./components/LifeExpectancySection";
import FooterSection from "./components/FooterSection";
import { storyConfig } from "./data/storyData";

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <MapProvider>
      <div
        ref={mainRef}
        style={{
          background: "#F5FFFE",
          color: "#0f172a",
          minHeight: "100vh",
        }}
      >
        <HeroSection config={storyConfig} />

        {/* Uncomment saat section sudah dibuat: */}
        <IntroSection /> 
        <BpjsSection /> 
        <FacilitySection />
        <QuotesSection />
        <MedicalSection /> 
        <LifeExpectancySection /> 

        <ScrollySection />

        {/* <FooterSection /> */}
      </div>
    </MapProvider>
  );
}

export default App;
