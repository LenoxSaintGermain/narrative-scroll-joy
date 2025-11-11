import { useEffect, useRef, useState } from "react";

interface FeatureSectionProps {
  title: string;
  eyebrow?: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}

export default function FeatureSection({ title, eyebrow, description, image, imageAlt, reverse }: FeatureSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setVisible(entry.isIntersecting));
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[180vh]">
      <div className="sticky top-0 grid h-screen place-items-center">
        <div
          className={
            "container grid items-center gap-10 md:grid-cols-2 " + (reverse ? "md:grid-flow-col-dense" : "")
          }
        >
          <div className={"max-w-xl " + (visible ? "animate-enter" : "opacity-0 translate-y-4")}
          >
            {eyebrow && <p className="mb-2 text-sm text-muted-foreground">{eyebrow}</p>}
            <h2 className="mb-3 text-4xl font-semibold md:text-5xl">{title}</h2>
            <p className="text-muted-foreground md:text-lg">{description}</p>
          </div>
          <div className={"relative " + (visible ? "animate-scale-in" : "opacity-0 scale-95")}
          >
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              className="mx-auto w-full max-w-2xl rounded-xl border border-border/40 shadow-[var(--shadow-elegant)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
