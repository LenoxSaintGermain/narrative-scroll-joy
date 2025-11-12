import Hero from "@/components/sections/Hero";
import FeatureSection from "@/components/sections/FeatureSection";
import { landingContent } from "@/content/landing";

const Index = () => {
  const { hero, features, footer } = landingContent;
  
  return (
    <main>
      <Hero content={hero} />
      {features.map((feature, index) => (
        <FeatureSection
          key={index}
          eyebrow={feature.eyebrow}
          title={feature.title}
          description={feature.description}
          image={feature.image}
          imageAlt={feature.imageAlt}
          reverse={feature.reverse}
        />
      ))}
      <footer className="border-t border-border/40 py-10 text-center text-sm text-muted-foreground">
        <p>{footer.text}</p>
      </footer>
    </main>
  );
};

export default Index;

