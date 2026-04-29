// src/App.tsx
import { useRef } from "react";
import { MapProvider } from "./context/Mapcontext";
import NavSection from "./components/navigation";
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
import ShowSection from "./components/ShowSection";
import ConclusionSection from "./components/ConclusionSection";

const sectionBg: React.CSSProperties = {
  background: "radial-gradient(ellipse at 100% 50%, #B8FFE7 0%, #F5FFFE 65%)",
  position: "relative",
  zIndex: 2,
  isolation: "isolate",
};

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <MapProvider>
      <div
        ref={mainRef}
        style={{
          color: "#0f172a",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <NavSection />

        <section
          id="hero"
          style={{
            ...sectionBg,
            marginTop: "-62px",
          }}
        >
          <HeroSection/>
        </section>

        {/* 2. Latar Belakang */}
        <section id="latar-belakang" style={sectionBg}>
          <IntroSection />
        </section>

        {/* 3. BPJS */}
        <section id="bpjs" style={sectionBg}>
          <BpjsSection />
        </section>

        {/* 4. Fasilitas Kesehatan Per Kabupaten */}
        <section id="fasilitas" style={sectionBg}>
          <FacilitySection />
        </section>

        {/* 5. Quote */}
        <div style={sectionBg}>
          <QuotesSection />
        </div>

        {/* 6. Tenaga Kesehatan */}
        <section id="tenaga-medis" style={sectionBg}>
          <MedicalSection />
        </section>

        {/* 7. Tren AHH */}
        <section
          id="tren-ahh"
          style={{ position: "relative", zIndex: 2, isolation: "isolate" }}
        >
          <LifeExpectancySection />
        </section>

        {/* 8. Scrollytelling Mapbox */}
        <section id="peta" style={{ position: "relative", zIndex: 1 }}>
          <ScrollySection />
        </section>

        {/* 9. Kesimpulan — zIndex:1 agar globe terlihat saat fade-in berlangsung */}
        <section id="kesimpulan" style={{ position: "relative", zIndex: 1 }}>
          <ConclusionSection />
        </section>
        
        {/* 10. Sorotan */}
        <section id="sorotan" style={sectionBg}>
          <ShowSection />
        </section>

        {/* 11. Footer */}
        <FooterSection />
      </div>
    </MapProvider>
  );
}

export default App;
