import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/common/logo";
import { LanguageToggle } from "@/components/common/language-toggle";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in â€” GARHY | HYPER" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useLanguage();
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between border-e border-hairline bg-surface p-10 lg:flex">
        <Logo />
        <div className="max-w-md">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">GARHY | HYPER</p>
          <p className="mt-4 font-display text-4xl font-semibold leading-tight">
            {t("brand.tagline")}
          </p>
          <div className="mt-4 h-px w-12 bg-gold" />
        </div>
        <p className="text-xs text-muted-foreground" suppressHydrationWarning>
          آ© {new Date().getFullYear()} GARHY | HYPER
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-4 lg:hidden">
          <Logo />
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        <div className="absolute end-4 top-4 hidden gap-1 lg:flex">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-md">
            <h1 className="font-display text-3xl font-semibold">{t("auth.title")}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t("auth.subtitle")}</p>
            <div className="mt-3 h-px w-12 bg-gold" />

            <Tabs defaultValue="email" className="mt-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="email">
                  <Mail className="me-2 h-3.5 w-3.5" />
                  {t("auth.tabEmail")}
                </TabsTrigger>
                <TabsTrigger value="phone">
                  <Phone className="me-2 h-3.5 w-3.5" />
                  {t("auth.tabPhone")}
                </TabsTrigger>
                <TabsTrigger value="register">
                  <UserPlus className="me-2 h-3.5 w-3.5" />
                  {t("auth.tabRegister")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="mt-6">
                <EmailSignIn />
              </TabsContent>
              <TabsContent value="phone" className="mt-6">
                <PhoneSignIn />
              </TabsContent>
              <TabsContent value="register" className="mt-6">
                <Register />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailSignIn() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    navigate({ to: "/account" });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("auth.email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("auth.password")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
        {t("auth.signIn")}
      </Button>
    </form>
  );
}

function PhoneSignIn() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("OTP sent");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    navigate({ to: "/account" });
  };

  return (
    <form onSubmit={sent ? verify : sendOtp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">{t("auth.phone")}</Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+9665XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          disabled={sent}
        />
      </div>
      {sent && (
        <div className="space-y-2">
          <Label htmlFor="otp">{t("auth.otp")}</Label>
          <Input
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
        {sent ? t("auth.verify") : t("auth.sendOtp")}
      </Button>
    </form>
  );
}

function Register() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created â€” check your email");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("auth.name")}</Label>
        <Input
          id="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="r-email">{t("auth.email")}</Label>
        <Input
          id="r-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="r-password">{t("auth.password")}</Label>
        <Input
          id="r-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
        {t("auth.signUp")}
      </Button>
    </form>
  );
}


