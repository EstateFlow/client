import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, User } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

const CompleteSubscriptionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-3">
                Subscription Activated
              </h1>
              <p className="text-muted-foreground text-lg">
                Your subscription has been activated successfully
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-700">
                Welcome! Your subscription is now active and you have full
                access to all features.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                className="w-full cursor-pointer"
                size="lg"
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
                <User className="h-4 w-4 mr-2" />
                View My Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompleteSubscriptionPage;
