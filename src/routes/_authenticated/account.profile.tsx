import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/common/page-header";
import { FadeIn } from "@/components/motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/profile")({
  head: () => ({ meta: [{ title: "Profile â€” GARHY | HYPER" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setPhone(data.user?.phone ?? "");
    });
  }, []);

  return (
    <div>
      <PageHeader eyebrow={t("account.title")} title={t("account.profile")} />
      <FadeIn>
        <div className="max-w-2xl space-y-6 rounded-2xl border border-hairline bg-surface-elevated p-6 shadow-soft sm:p-8">
          <div className="space-y-2">
            <Label htmlFor="p-name">{t("auth.name")}</Label>
            <Input id="p-name" placeholder={t("auth.name")} autoComplete="name" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="p-email">{t("auth.email")}</Label>
              <Input id="p-email" type="email" value={email} readOnly autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-phone">{t("auth.phone")}</Label>
              <Input id="p-phone" type="tel" value={phone} readOnly autoComplete="tel" />
            </div>
          </div>
          <div className="border-t border-hairline pt-5">
            <Button disabled>{t("common.save")}</Button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

