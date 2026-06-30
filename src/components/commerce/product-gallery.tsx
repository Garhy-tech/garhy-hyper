"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X, ZoomIn } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const { dir } = useLanguage();
  const [idx, setIdx] = useState(0);
  const [full, setFull] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowRight") (dir === "rtl" ? prev : next)();
      if (e.key === "ArrowLeft") (dir === "rtl" ? next : prev)();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full, dir, images.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const onZoomMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <>
      <div className="space-y-3">
        <div
          className="group relative aspect-square overflow-hidden rounded-2xl bg-surface"
          onMouseMove={onZoomMove}
          onMouseLeave={() => setZoom(null)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={idx}
              src={images[idx]}
              alt={title}
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 80) (info.offset.x < 0 ? next : prev)();
              }}
              className="absolute inset-0 h-full w-full cursor-zoom-in object-cover"
              style={
                zoom
                  ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: "scale(1.8)" }
                  : undefined
              }
            />
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setFull(true)}
            aria-label="Expand"
            className="absolute end-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Expand className="h-4 w-4" />
          </button>
          <span className="pointer-events-none absolute start-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur">
            <ZoomIn className="h-3 w-3" />
            {idx + 1}/{images.length}
          </span>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="absolute start-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 group-hover:flex"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="absolute end-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-soft backdrop-blur transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 group-hover:flex"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Image ${i + 1}`}
                className={cn(
                  "h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  i === idx ? "border-brand" : "border-hairline opacity-70 hover:opacity-100",
                )}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {full && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-foreground/90 p-4"
            onClick={() => setFull(false)}
          >
            <button
              type="button"
              onClick={() => setFull(false)}
              aria-label="Close"
              className="absolute end-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              key={idx}
              src={images[idx]}
              alt={title}
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="max-h-full max-w-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


