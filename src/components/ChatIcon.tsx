import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatIcon({
  onClick,
  className = "",
  isOpen = false,
}: {
  onClick?: () => void;
  className?: string;
  isOpen?: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={`
        fixed bottom-6 right-2 sm:right-6 z-50 h-14 w-14 rounded-full shadow-lg
        bg-primary hover:bg-primary/90 text-primary-foreground
        transition-all duration-200 ease-in-out
        hover:scale-110 active:scale-95
        border border-border/20
        ${className}
      `}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
    </Button>
  );
}
