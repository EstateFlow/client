import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface RestorePasswordStep2PageProps {
  emailToken: string;
}

export default function RestorePasswordStep2Page({
  emailToken,
}: RestorePasswordStep2PageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    repeatPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    repeatPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      password: "",
      repeatPassword: "",
    };

    if (!formData.password) {
      newErrors.password = t("passwordRequired");
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = t("passwordMinLength");
      isValid = false;
    }

    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = t("passwordsDoNotMatch");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/password-reset
`,
        {
          token: emailToken,
          password: formData.password,
        },
      );

      setFormData({
        password: "",
        repeatPassword: "",
      });

      if (response.status === 200) {
        setIsLoading(false);
        setError(null);
        toast(t("success"), {
          description: t("passwordResetSuccess"),
        });
        setTimeout(() => navigate({ to: "/login-form" }), 2000);
      }
    } catch (error: any) {
      setIsLoading(false);
      setError("Invalid or expired token");
      toast(t("error"), {
        description: error.message || t("passwordResetFailed"),
      });
    }
  };

  return (
    <div className="flex gap-8 p-8 justify-center items-start">
      <form
        className="bg-background border border-border p-6 rounded-xl space-y-4 w-full max-w-sm relative shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="text-center text-2xl">🔑</div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t("newPassword")}</Label>
          <Input
            id="password"
            type="password"
            placeholder={t("newPasswordPlaceholder")}
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="repeat-password">{t("repeatPassword")}</Label>
          <Input
            id="repeatPassword"
            type="password"
            placeholder={t("repeatPassword")}
            value={formData.repeatPassword}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.repeatPassword && (
            <p className="text-red-500 text-sm">{errors.repeatPassword}</p>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center border border-red-300 bg-red-100 p-2 rounded mt-4">
            {error}
          </p>
        )}

        <Button
          className="w-full cursor-pointer transition-all ease-in-out duration-200"
          disabled={isLoading}
        >
          {isLoading ? t("sendingMessage") : t("continue")}
        </Button>
        <Link to="/restore-password-step1" className="[&.active]:underline">
          <Button
            variant="ghost"
            className="w-full cursor-pointer transition-all ease-in-out duration-200"
          >
            ← {t("back")}
          </Button>
        </Link>
      </form>
    </div>
  );
}
