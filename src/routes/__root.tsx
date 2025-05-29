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
import { BrowserRouter } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import type { ReactPayPalScriptOptions } from "@paypal/react-paypal-js";

function RootComponent() {
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  };

  const { checkAuth } = useAuthStore();
  const { user } = useUserStore();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    checkAuth(); // перевірка при завантаженні
  }, [checkAuth]);

  return (
    <>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <PayPalScriptProvider options={initialOptions}>
          <Header />
          <Outlet />
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
      </BrowserRouter>
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
