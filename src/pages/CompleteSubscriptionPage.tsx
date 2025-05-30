import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const CancelSubscriptionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <XCircle className="h-20 w-20 text-orange-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Subscription Cancelled
              </h1>
              <p className="text-muted-foreground text-lg">
                Your subscription setup has been cancelled
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-orange-700">
                No subscription has been created. You can try again or explore
                our other options.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full cursor-pointer"
                onClick={() => navigate({ to: "/" })}
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Home
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full cursor-pointer"
                onClick={() => navigate({ to: "/user-dashboard" })}
              >
                View My Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CancelSubscriptionPage;
