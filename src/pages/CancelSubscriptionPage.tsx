import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, Home, ArrowLeft, User } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const CancelSubscriptionPayment: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-600 shadow-lg">
          <CardContent className="pt-10 pb-12 text-center space-y-6">
            <div className="mb-8">
              <XCircle
                className="h-16 w-16 text-red-600 mx-auto mb-6"
                aria-hidden="true"
              />
              <h1 className="text-3xl font-semibold text-foreground mb-3">
                {t("subscriptionCancelled")}
              </h1>
              <p className="text-muted-foreground text-base">
                {t("subscriptionSetupCancelled")}
              </p>
            </div>

            <div className="bg-red-50 border border-red-600 rounded-lg p-6 mb-8">
              <p className="text-sm text-red-700">
                {t("noSubscriptionCreated")}
              </p>
            </div>

            <div className="space-y-4">
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                size="lg"
                onClick={() => window.history.back()}
                aria-label={t("tryAgain")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("tryAgain")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => navigate({ to: "/" })}
                aria-label={t("returnToHome")}
              >
                <Home className="h-4 w-4 mr-2" />
                {t("returnToHome")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => navigate({ to: "/user-dashboard" })}
                aria-label={t("viewMyAccount")}
              >
                <User className="h-4 w-4 mr-2" />
                {t("viewMyAccount")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CancelSubscriptionPayment;
