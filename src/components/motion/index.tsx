"use client";
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
  type HTMLMotionProps,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function FadeIn({
  children,
  delay = 0,
  y = 16,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "h1" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...rest
}: { children: ReactNode; className?: string } & HTMLMotionProps<"div">) {
  return (
    <motion.div variants={staggerItem} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

export function HoverLift({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   AnimatedCounter â€” spring-eased numeric counter that animates
   from 0 to `value` once it enters the viewport.
============================================================ */
export function AnimatedCounter({
  value,
  duration = 1.2,
  format = (n) => Math.round(n).toLocaleString(),
  className,
  prefix,
  suffix,
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 20, mass: 0.6 });
  const rounded = useTransform(spring, (v) => format(v));
  const [text, setText] = useState(format(reduce ? value : 0));

  useEffect(() => {
    if (reduce) {
      setText(format(value));
      return;
    }
    if (inView) {
      mv.set(value);
    }
    const unsub = rounded.on("change", (v) => setText(v));
    return () => unsub();
  }, [inView, value, mv, rounded, reduce, format, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/* ============================================================
   ProgressiveImage â€” blur-up image with smooth opacity fade.
============================================================ */
export function ProgressiveImage({
  src,
  alt,
  className,
  aspect = "aspect-square",
}: {
  src: string;
  alt: string;
  className?: string;
  aspect?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-surface ${aspect} ${className ?? ""}`}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(110deg, color-mix(in oklab, var(--brand) 8%, transparent), color-mix(in oklab, var(--brand) 2%, transparent))",
          opacity: loaded ? 0 : 1,
          transition: "opacity .4s ease",
        }}
      />
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        initial={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
        animate={loaded ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}


