import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserStore } from "@/store/userStore";

interface ConfirmChangePageProps {
  token: string;
  type: string;
}

export function ConfirmChangePage({ token, type }: ConfirmChangePageProps) {
  const { confirmEmailChange, confirmPasswordChange } = useUserStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Processing your request...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token || isProcessing) return;

    setIsProcessing(true);

    const confirm = async () => {
      try {
        if (type === "email") {
          await confirmEmailChange(token);
          setStatus("success");
          setMessage("Email updated successfully! Redirecting to dashboard...");
        } else if (type === "password") {
          await confirmPasswordChange(token);
          setStatus("success");
          setMessage(
            "Password updated successfully! Redirecting to dashboard...",
          );
        } else {
          throw new Error("Invalid confirmation type");
        }
        setTimeout(() => navigate({ to: "/user-dashboard" }), 3000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Something went wrong. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    };

    confirm();

    return () => {
      setIsProcessing(false);
    };
  }, [token, type, confirmEmailChange, confirmPasswordChange, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "error":
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Mail className="w-8 h-8 text-gray-400 dark:text-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <Card className="w-full max-w-md border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700">
              <Mail className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
          <CardTitle className="text-gray-900 dark:text-gray-100">
            {type === "email"
              ? "Email Change Confirmation"
              : "Password Change Confirmation"}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="flex justify-center">{getStatusIcon()}</div>

          <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>

          {status === "loading" && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <div className="h-full bg-blue-500 rounded-full w-1/3 animate-pulse"></div>
            </div>
          )}

          {status === "success" && (
            <Alert className="text-left border-green-500 dark:border-green-400">
              <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
              <AlertDescription className="text-gray-700 dark:text-gray-200">
                Your {type === "email" ? "email" : "password"} has been updated
                successfully. You will be redirected to your dashboard shortly.
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Alert
                variant="destructive"
                className="text-left border-red-500 dark:border-red-400"
              >
                <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                <AlertDescription className="text-gray-700 dark:text-gray-200">
                  {message}
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/user-dashboard" })}
                  className="w-full text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
