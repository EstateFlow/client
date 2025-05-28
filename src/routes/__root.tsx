import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/authStore";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChatInterface } from "@/components/ChatInterface";
import { ChatIcon } from "@/components/ChatIcon";

function RootComponent() {
  const { checkAuth, user } = useAuthStore();
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    checkAuth(); // перевірка при завантаженні
  }, [checkAuth]);

  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Header />
        <Outlet />
        <Toaster />
        {user && user.role && (
          <>
            <ChatInterface
              isOpen={isChatOpen}
              onClose={() => setIsChatOpen(false)}
            />
            <ChatIcon onClick={handleChatToggle} isOpen={isChatOpen} />
          </>
        )}
        <TanStackRouterDevtools />
      </GoogleOAuthProvider>
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
