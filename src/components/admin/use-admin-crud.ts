import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";

/**
 * Shared client helpers for admin CRUD pages: runs a mutation, shows a toast,
 * and invalidates router loaders so the table (and the storefront) reflect the
 * change immediately on the next render.
 */
export function useAdminCrud() {
  const router = useRouter();
  const { t } = useLanguage();
  const [busy, setBusy] = useState(false);

  async function run<T>(fn: () => Promise<T>, successKey: string): Promise<T | undefined> {
    setBusy(true);
    try {
      const result = await fn();
      await router.invalidate();
      toast.success(t(successKey));
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || t("admin.crud.saveError"));
      return undefined;
    } finally {
      setBusy(false);
    }
  }

  return { busy, run };
}
