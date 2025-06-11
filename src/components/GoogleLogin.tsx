import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "./ui/button";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface GoogleLoginProps {
  role?: string;
  onValidationError?: () => void;
}

export function GoogleLogin({ role, onValidationError }: GoogleLoginProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { googleLogin, isLoading } = useAuthStore();

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        const response = await googleLogin(code, role);
        toast("Success", {
          description: response.message || "Logged in via Google",
        });
        navigate({ to: "/" });
      } catch (error: any) {
        toast("Error", {
          description: error.message || "Google login failed",
        });
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      toast("Error", {
        description: "Failed to initiate Google login. Please try again.",
      });
    },
    flow: "auth-code",
    scope: "email profile",
  });

  const handleClick = () => {
    if (role === undefined) {
      login();
      return;
    }
    if (!role) {
      toast("Error", {
        description: "Please select a role before signing in with Google.",
      });
      onValidationError?.();
      return;
    }
    login();
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="w-full border-gray-300 text-gray-900 dark:border-gray-600 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isLoading}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12.24 10.4V14.8H16.4C15.6 17.3 13.8 19 11.5 19C8.4 19 5.9 16.5 5.9 13.5C5.9 10.5 8.4 8 11.5 8C13 8 14.3 8.6 15.3 9.7L17.8 7.2C16.1 5.6 14.1 4.5 11.5 4.5C6.5 4.5 2.4 8.6 2.4 13.5C2.4 18.4 6.5 22.5 11.5 22.5C16.2 22.5 20 19.2 20 13.5C20 12.7 19.9 11.9 19.7 11.2H12.24Z"
        />
      </svg>
      {isLoading ? t("signingIn") : t("googleSignIn")}
    </Button>
  );
}
