import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, Home, ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const CancelPaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-red-600 shadow-lg">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <XCircle
                className="h-16 w-16 text-red-600 mx-auto mb-6"
                aria-hidden="true"
              />
              <h1 className="text-3xl font-semibold text-foreground mb-3">
                {t("paymentCancelled")}
              </h1>
              <p className="text-muted-foreground text-base">
                {t("paymentCancelledDescription")}
              </p>
            </div>

            <div className="bg-red-50 border-red border-red600 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-700">{t("noChargesInfo")}</p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full"
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
                className="w-full"
                onClick={() => navigate({ to: "/" })}
                aria-label={t("returnToHome")}
              >
                <Home className="h-4 w-4 mr-2" />
                {t("returnToHome")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate({ to: "/listings" })}
                aria-label={t("continueShopping")}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                {t("continueShopping")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CancelPaymentPage;
