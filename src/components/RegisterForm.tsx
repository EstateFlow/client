import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { X, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { GoogleLogin } from "./GoogleLogin";
import { useUserStore, type UserRole } from "@/store/userStore";
import { useTranslation } from "react-i18next";

export function RegisterForm() {
  const { t } = useTranslation();
  const [socialRole, setSocialRole] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "",
    socialRole: "",
  });
  const [manualFormSubmitted, setManualFormSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  const { register, isLoading, error, clearError } = useAuthStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  useEffect(() => {
    if (user) {
      toast(t("success"), {
        description: t("registrationSuccess"),
      });
      clearError();
    }
  }, [user, navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      role: "",
      socialRole: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = t("usernameRequired");
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = t("emailRequired");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("invalidEmailFormat");
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = t("passwordRequired");
      isValid = false;
    } else {
      if (formData.password.length < 8) {
        newErrors.password = t("passwordMinLength8");
        isValid = false;
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = t("passwordUppercaseRequired");
        isValid = false;
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = t("passwordLowercaseRequired");
        isValid = false;
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = t("passwordNumberRequired");
        isValid = false;
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = t("passwordSpecialCharRequired");
        isValid = false;
      }
    }

    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = t("passwordsDoNotMatch");
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = t("roleRequired");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualFormSubmitted(true);

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role as UserRole,
      });
      setFormData({
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
        role: "",
      });
    } catch (error: any) {
      toast(t("error"), {
        description: error.message || t("registrationFailed"),
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });

    if (manualFormSubmitted) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  const handleManualRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
    if (manualFormSubmitted) {
      setErrors({ ...errors, role: "" });
    }
  };

  const handleSocialRoleChange = (value: string) => {
    setSocialRole(value);
    setErrors({ ...errors, socialRole: "" });
  };

  const shouldShowErrors = manualFormSubmitted && !isLoading;

  return (
    <div className="bg-background border border-border p-6 rounded-xl space-y-4 w-full max-w-sm relative shadow-sm">
      <Link
        to="/"
        className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
      </Link>

      <form onSubmit={handleManualSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="username">{t("login")}</Label>
          <Input
            id="username"
            placeholder={t("loginPlaceholder")}
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
          />
          {shouldShowErrors && errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          {shouldShowErrors && errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t("password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {shouldShowErrors && errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="repeatPassword">{t("repeatPassword")}</Label>
          <div className="relative">
            <Input
              id="repeatPassword"
              type={showPasswordRepeat ? "text" : "password"}
              placeholder={t("repeatPassword")}
              value={formData.repeatPassword}
              onChange={handleChange}
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
              onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
            >
              {showPasswordRepeat ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {shouldShowErrors && errors.repeatPassword && (
            <p className="text-red-500 text-sm">{errors.repeatPassword}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="socialRole">{t("rolePlaceholder")}</Label>
          <Select onValueChange={handleManualRoleChange} disabled={isLoading}>
            <SelectTrigger className="w-full border-input focus:border-ring focus:ring-ring">
              <SelectValue placeholder={t("rolePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="renter_buyer">{t("renter_buyer")}</SelectItem>
              <SelectItem value="private_seller">
                {t("private_seller")}
              </SelectItem>
            </SelectContent>
          </Select>
          {shouldShowErrors && errors.role && (
            <p className="text-red-500 text-sm">{errors.role}</p>
          )}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        <Button className="w-full cursor-pointer" disabled={isLoading}>
          {isLoading ? t("registering") : t("continue")}
        </Button>
      </form>

      <div className="flex items-center gap-4">
        <div className="flex-grow h-px bg-border" />
        <span className="text-xs text-muted-foreground">{t("or")}</span>
        <div className="flex-grow h-px bg-border" />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="socialRole">{t("socialRolePlaceholder")}</Label>
          <Select
            onValueChange={handleSocialRoleChange}
            disabled={isLoading}
            value={socialRole}
          >
            <SelectTrigger className="w-full border-input focus:border-ring focus:ring-ring">
              <SelectValue placeholder={t("rolePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="renter_buyer">{t("renter_buyer")}</SelectItem>
              <SelectItem value="private_seller">
                {t("private_seller")}
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.socialRole && (
            <p className="text-red-500 text-sm">{errors.socialRole}</p>
          )}
        </div>

        <GoogleLogin
          role={socialRole}
          onValidationError={() =>
            setErrors({
              ...errors,
              socialRole: t("googleLoginRoleRequired"),
            })
          }
        />
      </div>

      <Link to="/login-form" className="[&.active]:underline">
        <div className="text-sm text-center underline">{t("haveAccount")}</div>
      </Link>
    </div>
  );
}
