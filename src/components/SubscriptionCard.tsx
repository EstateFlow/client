import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, ChevronDown, Check, X } from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { $api, fetchUserById } from "@/api/BaseUrl";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useTranslation } from "react-i18next";

interface SubscriptionCardProps {
  userId: string;
}

interface PayPalOrderData {
  orderID: string;
}

export default function SubscriptionCard({ userId }: SubscriptionCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    user,
    subscription,
    isExpanded,
    setUser,
    setSubscription,
    toggleExpanded,
  } = useSubscriptionStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, subscriptionResponse] = await Promise.all([
          fetchUserById(userId),
          $api.get(`${import.meta.env.VITE_API_URL}/api/subscription`),
        ]);
        setUser(userResponse.data);
        setSubscription(subscriptionResponse.data.subscriptions[0]);
      } catch (error) {
        toast.error(t("failedToFetchData"));
        console.error("Fetch data error:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, setUser, setSubscription, t]);

  const hasActiveSubscription = user?.subscription?.status === "active";
  const listingLimit = user?.listingLimit || 5;
  const plan = hasActiveSubscription ? t("premium") : t("free");
  const formattedDate = user?.subscription?.endDate
    ? new Date(user.subscription.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;
  const price = hasActiveSubscription ? formattedDate : "$0.00";

  const paypalStyles = {
    color: "black" as const,
    layout: "vertical" as const,
    size: "medium" as const,
    label: "pay" as const,
  };

  const handleCreateOrder = async () => {
    if (!subscription) {
      toast.error(t("invalidOrderData"));
      return undefined;
    }
    try {
      const priceValue = parseFloat(subscription.price);
      if (isNaN(priceValue)) {
        toast.error(t("invalidPriceFormat"));
        throw new Error("Invalid price format");
      }

      const response = await $api.post(
        `${import.meta.env.VITE_API_URL}/api/subscription/create-subscription-order`,
        {
          amount: priceValue,
          item: {
            name: subscription.name,
            description: subscription.description,
          },
        },
      );
      return response.data.id;
    } catch (error) {
      toast.error(t("failedToCreateOrder"));
      console.error("Create order error:", error);
      throw error;
    }
  };

  const handleApprove = async (data: PayPalOrderData) => {
    if (!data?.orderID || !subscription || !user) {
      toast.error(t("invalidOrderData"));
      return;
    }

    try {
      await $api.post(
        `${import.meta.env.VITE_API_URL}/api/subscription/capture-subscription-order`,
        {
          orderId: data.orderID,
          userId,
          subscriptionPlanId: subscription.id,
          email: user.email,
        },
      );
      toast.success(t("paymentSuccessful"));
      navigate({ to: "/complete-subscription" });
    } catch (error) {
      toast.error(t("failedToCapturePayment"));
      console.error("Capture payment error:", error);
    }
  };

  const handleError = (error: unknown) => {
    console.error("PayPal error:", error);
    toast.error(t("failedToCapturePayment"));
    navigate({ to: "/cancel-subscription" });
  };

  if (!user || !subscription) {
    return null;
  }

  return (
    <Card className="border-l-4 border-l-blue-600">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" aria-hidden="true" />
              <span className="font-semibold">{t("subscription")}</span>
              <Badge
                variant={hasActiveSubscription ? "default" : "secondary"}
                className={
                  hasActiveSubscription
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }
              >
                {plan}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {5 - listingLimit} / {hasActiveSubscription ? "∞" : 5}{" "}
              {t("lowerListings")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!hasActiveSubscription && (
              <PayPalButtons
                createOrder={handleCreateOrder}
                onApprove={handleApprove}
                onError={handleError}
                style={paypalStyles}
                fundingSource="paypal"
                className="mt-2"
              />
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleExpanded}
              aria-label={t("toggleSubscriptionDetails")}
              className="hover:bg-blue-50"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </Button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="pt-4 border-t border-gray-200 space-y-4">
            <div
              className={`grid grid-cols-3 gap-4 text-sm transition-all duration-300 ${
                isExpanded
                  ? "transform translate-y-0 opacity-100"
                  : "transform translate-y-4 opacity-0"
              }`}
            >
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <p className="text-muted-foreground">{t("plan")}</p>
                <p className="font-medium">{plan}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <p className="text-muted-foreground">{t("used")}</p>
                <p className="font-medium">
                  {5 - listingLimit} / {hasActiveSubscription ? "∞" : 5}{" "}
                  {t("lowerListings")}
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <p className="text-muted-foreground">
                  {hasActiveSubscription ? t("expires") : t("price")}
                </p>
                <p className="font-medium">{price || t("free")}</p>
              </div>
            </div>
            <div
              className={`grid gap-4 text-sm transition-all duration-300 ${
                isExpanded
                  ? "transform translate-y-0 opacity-100"
                  : "transform translate-y-4 opacity-0"
              }`}
            >
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                <span>{t("unlimitedListings")}</span>
                {hasActiveSubscription ? (
                  <Check
                    className="w-4 h-4 text-green-500 transition-all duration-200"
                    aria-hidden="true"
                  />
                ) : (
                  <X
                    className="w-4 h-4 text-red-500 transition-all duration-200"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
