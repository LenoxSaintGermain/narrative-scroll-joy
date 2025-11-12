import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctas: {
    primary: { text: string; href: string };
    secondary: { text: string; href: string };
  };
  media: string;
}

interface HeroProps {
  content: HeroContent;
}

const Hero = ({ content }: HeroProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--pointer-x", `${x}px`);
      el.style.setProperty("--pointer-y", `${y}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <header
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/60 px-6 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_circle_at_var(--pointer-x,50%)_var(--pointer-y,50%),hsl(var(--ring)/0.18),transparent_60%)]" />

      <p className="mb-3 text-sm text-muted-foreground animate-fade-in">{content.eyebrow}</p>
      <h1 className="mx-auto max-w-3xl bg-clip-text text-5xl font-extrabold tracking-tight md:text-7xl">
        <span className="text-transparent bg-[var(--gradient-primary)] bg-clip-text">{content.title}</span>
      </h1>
      <p className="mt-4 max-w-xl text-balance text-muted-foreground md:text-lg">
        {content.subtitle}
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Button variant="hero" size="xl" asChild>
          <a href={content.ctas.primary.href}>{content.ctas.primary.text}</a>
        </Button>
        <Button variant="outline" size="lg" className="rounded-full" asChild>
          <a href={content.ctas.secondary.href}>{content.ctas.secondary.text}</a>
        </Button>
      </div>

      <figure className="relative mt-12 w-full max-w-5xl md:mt-20">
        <img
          src={content.media}
          alt={`${content.title} hero visual`}
          loading="eager"
          className="mx-auto h-auto w-full rounded-lg object-cover shadow-[var(--shadow-elegant)] animate-scale-in"
        />
      </figure>
    </header>
  );
};

export default Hero;
