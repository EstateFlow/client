import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  User,
  Building2,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { usePromptsStore } from "@/store/promptsStore";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownComponents } from "../components/MarkdownCompoents";
import Markdown from "markdown-to-jsx";
import { useTranslation } from "react-i18next";

interface Prompt {
  name: string;
  content: string;
}

interface SystemPrompts {
  renter: string;
  seller: string;
}

export default function PromptEditingPage() {
  const { t } = useTranslation();
  const { prompts, fetchAllPrompts, isLoading, updateSystemPrompt } =
    usePromptsStore();
  const [activeTab, setActiveTab] = useState<"renter" | "seller">("renter");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState({ renter: false, seller: false });
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompts>({
    renter: "",
    seller: "",
  });
  const [originalPrompts, setOriginalPrompts] = useState<SystemPrompts>({
    renter: "",
    seller: "",
  });
  const [hasChanges, setHasChanges] = useState({
    renter: false,
    seller: false,
  });

  useEffect(() => {
    fetchAllPrompts();
  }, [fetchAllPrompts]);

  useEffect(() => {
    const renterPrompt =
      prompts.find((p: Prompt) => p.name === "default-renter-buyer")?.content ||
      "";
    const sellerPrompt =
      prompts.find((p: Prompt) => p.name === "default-seller-agency")
        ?.content || "";
    const newPrompts = {
      renter: renterPrompt,
      seller: sellerPrompt,
    };
    setSystemPrompts(newPrompts);
    setOriginalPrompts(newPrompts);
  }, [prompts]);

  const handlePromptChange = (type: "renter" | "seller", value: string) => {
    setSystemPrompts((prev) => ({ ...prev, [type]: value }));
    setHasChanges((prev) => ({
      ...prev,
      [type]: value !== originalPrompts[type],
    }));
  };

  const handleSave = async (type: "renter" | "seller") => {
    try {
      const promptName =
        type === "renter" ? "default-renter-buyer" : "default-seller-agency";
      await updateSystemPrompt(promptName, systemPrompts[type]);
      setOriginalPrompts((prev) => ({
        ...prev,
        [type]: systemPrompts[type],
      }));
      setHasChanges((prev) => ({ ...prev, [type]: false }));
      toast.success(
        t("promptSaved", {
          type: t(type === "renter" ? "renterBuyer" : "sellerAgency"),
        }),
      );
    } catch (error: any) {
      toast.error(t("saveFailed"));
      console.error(`Failed to save ${type} prompt:`, error);
    }
  };

  const handleReset = (type: "renter" | "seller") => {
    setSystemPrompts((prev) => ({
      ...prev,
      [type]: originalPrompts[type],
    }));
    setHasChanges((prev) => ({ ...prev, [type]: false }));
    toast.info(
      t("promptReset", {
        type: t(type === "renter" ? "renterBuyer" : "sellerAgency"),
      }),
    );
  };

  const handleCopy = async (type: "renter" | "seller") => {
    try {
      await navigator.clipboard.writeText(systemPrompts[type]);
      setCopied((prev) => ({ ...prev, [type]: true }));
      toast.success(t("promptCopied"));
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      toast.error(t("copyFailed"));
      console.error(`Failed to copy ${type} prompt:`, err);
    }
  };

  const getCharacterCount = (text: string): number => text.length;
  const getWordCount = (text: string): number =>
    text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-6">
            <Skeleton className="h-12 w-[400px]" />
            <Card className="shadow-lg rounded-lg">
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-6 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!prompts.length) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl text-center text-gray-700 dark:text-gray-300">
          {t("noPromptsFound")}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {t("aiPromptEditor")}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("configurePrompts")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="gap-1">
              <MessageSquare className="w-3 h-3" />
              {t("activePrompts")}: {prompts.length}
            </Badge>
            <Badge
              variant={
                hasChanges.renter || hasChanges.seller
                  ? "destructive"
                  : "secondary"
              }
              className={
                hasChanges.renter || hasChanges.seller
                  ? "bg-red-600 text-white"
                  : ""
              }
            >
              {hasChanges.renter || hasChanges.seller
                ? t("unsavedChanges")
                : t("allSaved")}
            </Badge>
          </div>
          <Separator className="my-4" />
        </div>
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "renter" | "seller")}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="renter" className="gap-2">
              <User className="w-4 h-4" />
              {t("renterBuyer")}
              {hasChanges.renter && (
                <div className="w-2 h-2 bg-red-600 rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="seller" className="gap-2">
              <Building2 className="w-4 h-4" />
              {t("sellerAgency")}
              {hasChanges.seller && (
                <div className="w-2 h-2 bg-red-600 rounded-full" />
              )}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="renter" className="space-y-6">
            <Card className="shadow-lg rounded-lg border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      {t("renterPromptTitle")}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {t("renterPromptDesc")}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="gap-2"
                    aria-label={showPreview ? t("hide") : t("preview")}
                  >
                    {showPreview ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    {showPreview ? t("hide") : t("preview")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="renter-prompt"
                      className="text-sm font-medium"
                    >
                      {t("promptContent")}
                    </Label>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {getWordCount(systemPrompts.renter)} {t("words")}
                      </span>
                      <span>
                        {getCharacterCount(systemPrompts.renter)}{" "}
                        {t("characters")}
                      </span>
                    </div>
                  </div>
                  {showPreview ? (
                    <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[300px]">
                      <Markdown
                        options={{ overrides: MarkdownComponents }}
                        className="text-sm whitespace-pre-wrap break-words"
                      >
                        {systemPrompts.renter}
                      </Markdown>
                    </div>
                  ) : (
                    <Textarea
                      id="renter-prompt"
                      value={systemPrompts.renter}
                      onChange={(e) =>
                        handlePromptChange("renter", e.target.value)
                      }
                      className="min-h-[300px] text-sm font-mono resize-none"
                      placeholder={t("renterPromptPlaceholder")}
                      aria-label={t("renterPromptPlaceholder")}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    {hasChanges.renter && (
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-600 dark:text-amber-400 dark:border-amber-400"
                      >
                        {t("unsavedChanges")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy("renter")}
                      className="gap-2"
                      aria-label={copied.renter ? t("copied") : t("copy")}
                    >
                      {copied.renter ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied.renter ? t("copied") : t("copy")}
                    </Button>
                    {hasChanges.renter && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReset("renter")}
                        className="gap-2"
                        aria-label={t("reset")}
                      >
                        <RefreshCw className="w-4 h-4" />
                        {t("reset")}
                      </Button>
                    )}
                    <Button
                      onClick={() => handleSave("renter")}
                      disabled={!hasChanges.renter}
                      size="sm"
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                      aria-label={t("saveChanges")}
                    >
                      <Save className="w-4 h-4" />
                      {t("saveChanges")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="seller" className="space-y-6">
            <Card className="shadow-lg rounded-lg border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      {t("sellerPromptTitle")}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {t("sellerPromptDesc")}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="gap-2"
                    aria-label={showPreview ? t("hide") : t("preview")}
                  >
                    {showPreview ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                    {showPreview ? t("hide") : t("preview")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="seller-prompt"
                      className="text-sm font-medium"
                    >
                      {t("promptContent")}
                    </Label>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {getWordCount(systemPrompts.seller)} {t("words")}
                      </span>
                      <span>
                        {getCharacterCount(systemPrompts.seller)}{" "}
                        {t("characters")}
                      </span>
                    </div>
                  </div>
                  {showPreview ? (
                    <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[300px]">
                      <Markdown
                        options={{ overrides: MarkdownComponents }}
                        className="text-sm whitespace-pre-wrap break-words"
                      >
                        {systemPrompts.seller}
                      </Markdown>
                    </div>
                  ) : (
                    <Textarea
                      id="seller-prompt"
                      value={systemPrompts.seller}
                      onChange={(e) =>
                        handlePromptChange("seller", e.target.value)
                      }
                      className="min-h-[300px] text-sm font-mono resize-none"
                      placeholder={t("sellerPromptPlaceholder")}
                      aria-label={t("sellerPromptPlaceholder")}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    {hasChanges.seller && (
                      <Badge
                        variant="outline"
                        className="text-amber-600 border-amber-600 dark:text-amber-400 dark:border-amber-400"
                      >
                        {t("unsavedChanges")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy("seller")}
                      className="gap-2"
                      aria-label={copied.seller ? t("copied") : t("copy")}
                    >
                      {copied.seller ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied.seller ? t("copied") : t("copy")}
                    </Button>
                    {hasChanges.seller && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReset("seller")}
                        className="gap-2"
                        aria-label={t("reset")}
                      >
                        <RefreshCw className="w-4 h-4" />
                        {t("reset")}
                      </Button>
                    )}
                    <Button
                      onClick={() => handleSave("seller")}
                      disabled={!hasChanges.seller}
                      size="sm"
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                      aria-label={t("saveChanges")}
                    >
                      <Save className="w-4 h-4" />
                      {t("saveChanges")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {(hasChanges.renter || hasChanges.seller) && (
          <Card className="mt-6 border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/10 shadow-lg rounded-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-900 dark:text-amber-100">
                      {t("youHaveUnsavedChanges")}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {t("savePromptsInstruction")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleReset("renter");
                      handleReset("seller");
                    }}
                    className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-800"
                    aria-label={t("resetAll")}
                  >
                    {t("resetAll")}
                  </Button>
                  <Button
                    onClick={() => {
                      if (hasChanges.renter) handleSave("renter");
                      if (hasChanges.seller) handleSave("seller");
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                    aria-label={t("saveAllChanges")}
                  >
                    {t("saveAllChanges")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
