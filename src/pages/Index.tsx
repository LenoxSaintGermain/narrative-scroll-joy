import Hero from "@/components/sections/Hero";
import FeatureSection from "@/components/sections/FeatureSection";
import titanium from "@/assets/titanium-close.jpg";
import camera from "@/assets/camera-pro-phone.jpg";
import chip from "@/assets/chip-perf.jpg";

const Index = () => {
  return (
    <main>
      <Hero />
      <FeatureSection
        eyebrow="Design"
        title="Titanium. Strong. Stunning."
        description="A precision-crafted titanium frame with a refined brushed finish. Lighter, tougher, and gorgeous from every angle."
        image={titanium}
        imageAlt="Brushed titanium frame close-up"
      />
      <FeatureSection
        eyebrow="Camera"
        title="A pro‑level camera system."
        description="Crisp detail, richer color, and astonishing low‑light. Every shot feels like a masterpiece."
        image={camera}
        imageAlt="Triple-lens camera module close-up"
        reverse
      />
      <FeatureSection
        eyebrow="Performance"
        title="Chip that changes the game."
        description="Next‑gen performance with incredible efficiency. Apps feel instant and graphics are buttery smooth."
        image={chip}
        imageAlt="High-tech performance chip on circuit board"
      />
      <footer className="border-t border-border/40 py-10 text-center text-sm text-muted-foreground">
        <p>Pro Phone — Narrative scroll demo. Built with love.</p>
      </footer>
    </main>
  );
};

export default Index;

