import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, X, Bot, User } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { LoadingDots } from "./LoadingDots";
import Markdown from "markdown-to-jsx";
import { aiStore } from "@/store/aiStore";
import type { Message } from "@/types/AiTypes";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    newMessage,
    setNewMessage,
    sendMessage,
    initializeConversation,
  } = aiStore();

  const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    if (isOpen) {
      initializeConversation();
    }
  }, [isOpen, initializeConversation]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setTimeout(() => scrollToBottom("smooth"), 50);
    }
  }, [isOpen, messages.length]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-24 right-2 sm:right-6 max-w-sm h-[500px] sm:w-96 sm:h-[600px] sm:max-w-md lg:max-w-lg shadow-2xl z-50 mx-2 sm:mx-0 flex flex-col border border-gray-200 dark:border-gray-700 rounded-3xl overflow-hidden p-2 bg-white dark:bg-gray-900">
      <CardHeader className="p-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold text-lg">
                AI
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                EstateFlow AI
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div
          className="h-full overflow-y-auto p-2 space-y-4"
          ref={messagesContainerRef}
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((message: Message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} items-start space-x-2 animate-in slide-in-from-bottom-2 duration-300`}
            >
              {message.sender === "ai" && (
                <Avatar className="w-8 h-8 mt-2 flex-shrink-0">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gray-700 text-white text-xs font-semibold">
                    <Bot />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                <Markdown className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </Markdown>
              </div>
              {message.sender === "user" && (
                <Avatar className="w-8 h-8 mt-2 flex-shrink-0">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 text-xs font-semibold">
                    <User />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start items-start space-x-2 animate-in slide-in-from-bottom-2 duration-300">
              <Avatar className="w-8 h-8 mt-2 layer">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gray-700 text-white text-xs font-semibold">
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-800 text-gray-100 rounded-2xl px-4 py-2">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <Separator className="bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      <CardFooter className="p-2 flex-shrink-0">
        <div className="flex items-center space-x-3 w-full">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full bg-gray-100 dark:bg-gray-800 border-0 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600"
              disabled={isLoading}
            />
          </div>
          <Button
            size="icon"
            className="h-12 w-12 rounded-2xl bg-gray-600 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-white disabled:opacity-50"
            disabled={isLoading || !newMessage.trim()}
            onClick={sendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
