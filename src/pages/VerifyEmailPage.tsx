import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle, XCircle, Mail, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function VerifyEmailPage({ emailToken }: { emailToken: string }) {
  const [message, setMessage] = useState("Verifying your email...");
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!emailToken || isVerifying) return;

    setIsVerifying(true);

    const verify = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/auth/verify-email/${emailToken}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setStatus("success");
        setMessage("Email verified successfully! Redirecting to login...");
        setTimeout(() => navigate({ to: "/login-form" }), 3000);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Something went wrong. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    verify();

    return () => {
      setIsVerifying(false);
    };
  }, [emailToken, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "error":
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Mail className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-muted">
              <Mail className="w-6 h-6" />
            </div>
          </div>
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="flex justify-center">{getStatusIcon()}</div>

          <p className="text-sm text-muted-foreground">{message}</p>

          {status === "loading" && (
            <div className="w-full bg-secondary rounded-full h-1">
              <div className="h-full bg-primary rounded-full w-1/3 animate-pulse"></div>
            </div>
          )}

          {status === "success" && (
            <Alert className="text-left">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your email has been verified successfully. You will be
                redirected shortly.
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Alert variant="destructive" className="text-left">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/login-form" })}
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
