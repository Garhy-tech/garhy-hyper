import { MessageCircle } from "lucide-react";

const PHONE = "96801222339088";
const MESSAGE = "مرحبًا، أرغب في الاستفسار عن المنتجات والخدمات المتاحة.";

export function WhatsAppFloat() {
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="group fixed bottom-[calc(env(safe-area-inset-bottom)+76px)] end-4 z-50 flex items-center gap-2 rounded-full border border-white/30 bg-[#25D366]/95 px-4 py-3 text-white shadow-[0_12px_40px_-8px_rgba(37,211,102,0.55)] backdrop-blur-md transition-all hover:scale-105 hover:shadow-[0_16px_50px_-8px_rgba(37,211,102,0.7)] sm:bottom-6 sm:end-6"
    >
      <span className="relative grid h-6 w-6 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
        <MessageCircle className="relative h-5 w-5" />
      </span>
      <span className="hidden text-sm font-semibold sm:inline">واتساب</span>
    </a>
  );
}
