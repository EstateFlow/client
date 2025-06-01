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

interface SubscriptionCardProps {
  userId: string;
}

export default function SubscriptionCard({ userId }: SubscriptionCardProps) {
  const {
    user,
    subscription,
    isExpanded,
    setUser,
    setSubscription,
    toggleExpanded,
  } = useSubscriptionStore();
  const navigate = useNavigate();

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
        toast.error("Failed to fetch data. Please try again.");
        console.error(error);
      }
    };

    fetchData();
  }, [userId, setUser, setSubscription]);

  const hasActiveSubscription = user?.subscription?.status === "active";
  const listingLimit = user?.listingLimit || 5;
  const plan = hasActiveSubscription ? "Premium" : "Free";
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
    if (!subscription) return;
    try {
      const price = parseFloat(subscription.price);
      if (isNaN(price)) {
        toast.error("Invalid price format. Please contact support.");
        throw new Error("Invalid price format");
      }

      const response = await $api.post(
        `${import.meta.env.VITE_API_URL}/api/subscription/create-subscription-order`,
        {
          amount: price,
          item: {
            name: subscription.name,
            description: subscription.description,
          },
        },
      );
      return response.data.id;
    } catch (error) {
      toast.error("Failed to create subscription order. Please try again.");
      throw error;
    }
  };

  const handleApprove = async (data: { orderID: string }) => {
    if (!data?.orderID || !subscription || !user) {
      toast.error("Invalid order or user data. Please try again.");
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
      navigate({ to: "/complete-subscription" });
    } catch (error) {
      toast.error("Failed to capture payment. Please try again.");
      console.error(error);
    }
  };

  const handleError = (error: unknown) => {
    console.error(error);
    navigate({ to: "/cancel-subscription" });
  };

  if (!user || !subscription) return null;

  console.log(user);

  return (
    <Card className="border-l-4 border-l-blue-500 py-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">Subscription</span>
              <Badge variant={hasActiveSubscription ? "default" : "secondary"}>
                {plan}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {5 - listingLimit} / {hasActiveSubscription ? "∞" : 5} listings
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!hasActiveSubscription && (
              <PayPalButtons
                createOrder={handleCreateOrder}
                onApprove={handleApprove}
                onError={handleError}
                style={paypalStyles}
                className="mt-4"
                fundingSource="paypal"
              />
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleExpanded}
              className="transition-transform duration-200 ease-in-out hover:scale-105"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                  isExpanded ? "rotate-180" : "rotate-0"
                }`}
              />
            </Button>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="pt-4 border-t space-y-4">
            <div
              className={`grid grid-cols-3 gap-4 text-sm transition-all duration-300 ease-in-out delay-75 ${
                isExpanded
                  ? "transform translate-y-0 opacity-100"
                  : "transform translate-y-4 opacity-0"
              }`}
            >
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <p className="text-muted-foreground">Plan</p>
                <p className="font-medium">{plan}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <p className="text-muted-foreground">Used</p>
                <p className="font-medium">
                  {5 - listingLimit} / {hasActiveSubscription ? "∞" : 5}{" "}
                  listings
                </p>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <p className="text-muted-foreground">
                  {hasActiveSubscription ? "Expires" : "Price"}
                </p>
                <p className="font-medium">{price}</p>
              </div>
            </div>
            <div
              className={`grid gap-4 text-sm transition-all duration-300 ease-in-out delay-100 ${
                isExpanded
                  ? "transform translate-y-0 opacity-100"
                  : "transform translate-y-4 opacity-0"
              }`}
            >
              <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                <span>Unlimited Listings</span>
                {hasActiveSubscription ? (
                  <Check className="w-4 h-4 text-green-500 transition-all duration-200" />
                ) : (
                  <X className="w-4 h-4 text-red-500 transition-all duration-200" />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
