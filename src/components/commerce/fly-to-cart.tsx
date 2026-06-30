"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/commerce-context";

/**
 * Renders a brief arc animation from origin (rect of "Add" button)
 * to the cart icon (#cart-target). Listens to flyNonce from cart context.
 */
export function FlyToCart() {
  const { flyOrigin, flyNonce } = useCart();
  const [flights, setFlights] = useState<
    { id: number; from: { x: number; y: number }; to: { x: number; y: number } }[]
  >([]);

  useEffect(() => {
    if (!flyOrigin || flyNonce === 0) return;
    const target = document.getElementById("cart-target");
    if (!target) return;
    const t = target.getBoundingClientRect();
    setFlights((prev) => [
      ...prev,
      {
        id: flyNonce,
        from: { x: flyOrigin.left + flyOrigin.width / 2, y: flyOrigin.top + flyOrigin.height / 2 },
        to: { x: t.left + t.width / 2, y: t.top + t.height / 2 },
      },
    ]);
  }, [flyNonce, flyOrigin]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      <AnimatePresence>
        {flights.map((f) => (
          <motion.div
            key={f.id}
            initial={{ x: f.from.x - 16, y: f.from.y - 16, opacity: 1, scale: 1 }}
            animate={{
              x: [f.from.x - 16, (f.from.x + f.to.x) / 2 - 16, f.to.x - 16],
              y: [f.from.y - 16, Math.min(f.from.y, f.to.y) - 140, f.to.y - 16],
              opacity: [1, 1, 0.2],
              scale: [1, 0.9, 0.4],
            }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], times: [0, 0.6, 1] }}
            onAnimationComplete={() => setFlights((prev) => prev.filter((p) => p.id !== f.id))}
            className="absolute h-8 w-8 rounded-full bg-conversion shadow-elevated ring-2 ring-background"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
