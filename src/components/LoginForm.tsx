import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { GoogleLogin } from "./GoogleLogin";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";

export function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = useAuthStore();
  const { user } = useUserStore();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  useEffect(() => {
    if (user) {
      navigate({ to: "/" });
      clearError();
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    try {
      await login(email, password);
    } catch (err: any) {}
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-background border border-border p-6 rounded-xl space-y-4 w-full max-w-sm relative shadow-sm"
    >
      <Link
        to="/"
        className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
      </Link>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-input focus:border-ring focus:ring-ring"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-input focus:border-ring focus:ring-ring"
          disabled={isLoading}
        />
      </div>

      <Link to="/restore-password-step1" className="[&.active]:underline">
        <div className="text-right text-sm text-blue-500 cursor-pointer underline mb-2">
          {t("forgotPassword")}
        </div>
      </Link>

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded mt-4">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? t("loggingIn") : t("continue")}
      </Button>

      <div className="flex items-center gap-4">
        <div className="flex-grow h-px bg-border" />
        <span className="text-xs text-muted-foreground">{t("or")}</span>
        <div className="flex-grow h-px bg-border" />
      </div>

      <GoogleLogin />

      <Link to="/register-form" className="[&.active]:underline">
        <div className="text-sm text-center underline">
          {t("dontHaveAccount")}
        </div>
      </Link>
    </form>
  );
}
