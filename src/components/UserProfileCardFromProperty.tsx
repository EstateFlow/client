import { useEffect, useState } from "react";
import { fetchUserById } from "@/api/BaseUrl";
import type { UserInfo } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { uk, enUS } from "date-fns/locale";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        toast.error(t("userLoadingError"));
        setLoading(false);
        return;
      }
      try {
        const res = await fetchUserById(userId);
        setUser(res.data);
      } catch (err) {
        toast.error(t("userLoadingError"));
        console.error("Error during user loading:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, t]);

  const handleCopyEmail = async () => {
    if (!user?.email) return;
    try {
      await navigator.clipboard.writeText(user.email);
      toast.success(t("success"), { description: t("emailCopied") });
    } catch {
      toast.error(t("error"), { description: t("emailCopyFailed") });
    }
  };

  // Select date-fns locale based on i18next language
  const locale = i18n.language === "uk" ? uk : enUS;

  const formatDate = (date: string | undefined) => {
    if (!date || isNaN(new Date(date).getTime())) return t("notAvailable");
    return format(new Date(date), "dd MMM yyyy, HH:mm", { locale });
  };

  if (loading) {
    return (
      <Card className="rounded-lg overflow-hidden shadow-lg max-w-4xl mx-auto">
        <CardContent className="flex flex-col sm:flex-row gap-6 p-8 animate-pulse">
          <div className="flex flex-col items-center sm:items-start gap-4">
            <div className="rounded-full bg-muted w-28 h-28"></div>
            <div className="text-center sm:text-left w-full">
              <div className="h-4 bg-muted rounded w-20 mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="h-4 bg-muted rounded w-16 mb-2"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
        <CardContent className="p-8 text-center text-gray-700 dark:text-gray-300">
          {t("userNotFound")}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
      <CardContent className="flex flex-col sm:flex-row gap-8 p-8">
        <div className="flex flex-col items-center sm:items-start gap-6 min-w-[180px]">
          <div className="rounded-full w-28 h-28 overflow-hidden shadow-md border-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-5xl text-gray-600 dark:text-gray-400">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={t("userAvatar")}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              "👤"
            )}
          </div>
          <div className="text-center sm:text-left space-y-2">
            <p className="font-semibold text-lg">{t("aboutMe")}</p>
            <p className="text-gray-700 dark:text-gray-300 min-h-[3rem] whitespace-pre-wrap">
              {user.bio || t("noBioProvided")}
            </p>
            <p
              className="text-sm mt-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-1 select-all cursor-pointer transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={handleCopyEmail}
              role="button"
              aria-label={t("clickToCopyEmail")}
              title={t("clickToCopyEmail")}
            >
              {user.email}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 flex-1 text-sm text-gray-700 dark:text-gray-300">
          {[
            { label: t("username"), value: user.username || t("notAvailable") },
            { label: t("status"), value: user.role || t("notAvailable") },
            {
              label: t("paypal"),
              value:
                user.paypalCredentials &&
                (user.role === "private_seller" || user.role === "agency")
                  ? user.paypalCredentials
                  : t("notAvailable"),
            },
            {
              label: t("offerLimit"),
              value: user.listingLimit ?? t("notAvailable"),
            },
            {
              label: t("dateOfRegistration"),
              value: formatDate(user.createdAt),
            },
            {
              label: t("lastProfileUpdate"),
              value: formatDate(user.updatedAt),
            },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1">
              <p className="text-muted-foreground font-medium">{label}</p>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

