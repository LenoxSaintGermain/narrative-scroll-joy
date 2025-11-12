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
    eyebrow: "Introducing",
    title: "Interactive Career Agent",
    subtitle: "An AI-powered career showcase that transforms how you present your professional story. Experience intelligent narrative scrolling with dynamic insights.",
    ctas: {
      primary: { text: "Explore", href: "#features" },
      secondary: { text: "Learn more", href: "#about" },
    },
    media: "/hero-pro-phone.jpg",
  },
  features: [
    {
      eyebrow: "Intelligence",
      title: "Signal. Pattern. Insight.",
      description: "Advanced AI analyzes your career trajectory, identifying key patterns and translating complex achievements into compelling narratives that resonate with your audience.",
      image: "/titanium-close.jpg",
      imageAlt: "AI-powered career intelligence dashboard",
      reverse: false,
    },
    {
      eyebrow: "Experience",
      title: "Professional storytelling, reimagined.",
      description: "Transform your resume into an interactive journey. Dynamic visualizations and narrative flow create an unforgettable first impression with hiring managers and recruiters.",
      image: "/camera-pro-phone.jpg",
      imageAlt: "Interactive career showcase interface",
      reverse: true,
    },
    {
      eyebrow: "Performance",
      title: "Metrics that matter.",
      description: "Real-time analytics track engagement, conversion, and impact. Understand exactly how your story performs and optimize for maximum career acceleration.",
      image: "/chip-perf.jpg",
      imageAlt: "Career performance analytics dashboard",
      reverse: false,
    },
  ],
  footer: {
    text: "Career Agent — Intelligent portfolio platform. Built with precision.",
  },
};
