import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export function LanguageToggle() {
  const { lang, toggle } = useLanguage();
  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label="Toggle language"
      onClick={toggle}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      <span className="font-medium">{lang === "ar" ? "EN" : "ط¹"}</span>
    </Button>
  );
}

