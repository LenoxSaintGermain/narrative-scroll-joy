// Content configuration for the narrative landing page
// Edit this file to update all copy and media across the landing experience

export interface LandingContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctas: {
      primary: { text: string; href: string };
      secondary: { text: string; href: string };
    };
    media: string;
  };
  features: FeatureContent[];
  footer: {
    text: string;
  };
}

export interface FeatureContent {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}

export const landingContent: LandingContent = {
  hero: {
    eyebrow: "The Signal",
    title: "Pattern Recognition as Method",
    subtitle: "Not a superpower. Just scar tissue organized into methodology. Behavioral economics applied to operational chaos, guaranteeing EBITDA impact before you commit.",
    ctas: {
      primary: { text: "Show Me The Proof", href: "#campground" },
      secondary: { text: "Calculate My Impact", href: "#calculator" },
    },
    media: "/src/assets/hero-office.png",
  },
  features: [
    {
      eyebrow: "The Campground",
      title: "Low-stakes proof. High-stakes clarity.",
      description: "Start in the campground—a $12K, 10-day environment where we prove the pattern works before scaling. 40% time reduction in controlled chaos. No enterprise commitments until you see results.",
      image: "/src/assets/office-suite.png",
      imageAlt: "Controlled proof-of-concept environment showing pattern validation",
      reverse: false,
    },
    {
      eyebrow: "Pattern Translation",
      title: "From chaos to universal.",
      description: "Every organization has the same five patterns hiding beneath unique jargon. We identify yours—asset flow, information retrieval, resource allocation—then translate them into frameworks with 94% success rates.",
      image: "/src/assets/office-luxury.png",
      imageAlt: "Pattern recognition dashboard translating chaos into actionable insights",
      reverse: true,
    },
    {
      eyebrow: "The Bomb Factory",
      title: "Scale with precision. Guarantee the outcome.",
      description: "School traffic patterns become factory floor optimization—$3.2M in annual savings, 3.4 EBITDA points. Pay only when audited results materialize. 9.3:1 average ROI across enterprise implementations.",
      image: "/src/assets/camera-pro-phone.jpg",
      imageAlt: "Enterprise-scale results dashboard with EBITDA impact metrics",
      reverse: false,
    },
  ],
  footer: {
    text: "Signal Intelligence — Behavioral economics as methodology. Built on scar tissue.",
  },
};
