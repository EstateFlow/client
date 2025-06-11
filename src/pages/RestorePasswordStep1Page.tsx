import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function RestorePasswordStep1Page() {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/user/password-reset-request`,
      {
        email,
      },
    );

    if (response.status === 200) {
      setIsLoading(false);
      setError(null);
      toast("Success", {
        description: "Please check your email!",
      });
    } else {
      setIsLoading(false);
      setError("There are no user with such email");
      toast("Error", {
        description: "There are no user with such email",
      });
    }
  };
  return (
    <div className="flex gap-8 p-8 justify-center items-start">
      <form
        className="bg-background border border-border p-6 rounded-xl space-y-4 w-full max-w-sm relative shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="text-center text-2xl">🔒</div>
        <div className="text-center text-sm">{t("enterEmailNotice")}</div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={handleChange}
          />
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
        <Link to="/login-form" className="[&.active]:underline ">
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
