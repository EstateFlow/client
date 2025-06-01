import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/authStore";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChatInterface } from "@/components/ChatInterface";
import { ChatIcon } from "@/components/ChatIcon";
import { useUserStore } from "@/store/userStore";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import type { ReactPayPalScriptOptions } from "@paypal/react-paypal-js";
import { RealEstateLoader } from "@/components/RealEstateLoader";

function RootComponent() {
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  };

  const { checkAuth, isInitialized } = useAuthStore();
  const { user } = useUserStore();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [checkAuth, isInitialized]);

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <PayPalScriptProvider options={initialOptions}>
          <Header />
          {!isInitialized ? <RealEstateLoader /> : <Outlet />}
          <Toaster />
          {user &&
            ["renter_buyer", "private_seller", "agency"].includes(
              user.role,
            ) && (
              <>
                <ChatInterface
                  isOpen={isChatOpen}
                  onClose={() => setIsChatOpen(false)}
                />
                <ChatIcon onClick={handleChatToggle} isOpen={isChatOpen} />
              </>
            )}
          <TanStackRouterDevtools />
        </PayPalScriptProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
