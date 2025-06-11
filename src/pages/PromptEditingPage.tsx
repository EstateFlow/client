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

export default function PromptEditingPage() {
  const { t } = useTranslation();
  const { prompts, fetchAllPrompts, isLoading, updateSystemPrompt } =
    usePromptsStore();
  const [activeTab, setActiveTab] = useState("renter");
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState({ renter: false, seller: false });

  useEffect(() => {
    fetchAllPrompts();
  }, [fetchAllPrompts]);

  const [systemPrompts, setSystemPrompts] = useState<any>({
    renter:
      prompts.find((p) => p.name === "renter")?.content ||
      `You are an AI assistant helping renters and buyers find their ideal property...`,
    seller:
      prompts.find((p) => p.name === "seller")?.content ||
      `You are an AI assistant helping private sellers and agencies market their properties effectively...`,
  });

  const [originalPrompts, setOriginalPrompts] = useState(systemPrompts);
  const [hasChanges, setHasChanges] = useState({
    renter: false,
    seller: false,
  });

  useEffect(() => {
    setSystemPrompts({
      renter:
        prompts.find((p) => p.name === "default-renter-buyer")?.content ||
        systemPrompts.renter,
      seller:
        prompts.find((p) => p.name === "default-seller-agency")?.content ||
        systemPrompts.seller,
    });
    setOriginalPrompts({
      renter:
        prompts.find((p) => p.name === "default-renter-buyer")?.content ||
        systemPrompts.renter,
      seller:
        prompts.find((p) => p.name === "default-seller-agency")?.content ||
        systemPrompts.seller,
    });
  }, [prompts]);

  const handlePromptChange = (type: string, value: string) => {
    setSystemPrompts((prev: any) => ({ ...prev, [type]: value }));
    setHasChanges((prev) => ({
      ...prev,
      [type]: value !== originalPrompts[type],
    }));
  };

  const handleSave = async (type: string) => {
    try {
      await updateSystemPrompt(
        type === "renter" ? "default-renter-buyer" : "default-seller-agency",
        systemPrompts[type],
      );
      setOriginalPrompts((prev: any) => ({
        ...prev,
        [type]: systemPrompts[type],
      }));
      setHasChanges((prev) => ({ ...prev, [type]: false }));
      toast(t("success"), {
        description: t(
          type === "renter" ? "renterPromptSaved" : "sellerPromptSaved",
        ),
      });
    } catch (error: any) {
      toast(t("error"), {
        description: error.message || t("promptSaveFailed"),
      });
    }
  };

  const handleReset = (type: string) => {
    setSystemPrompts((prev: any) => ({
      ...prev,
      [type]: originalPrompts[type],
    }));
    setHasChanges((prev) => ({ ...prev, [type]: false }));
    toast.info(
      t(type === "renter" ? "renterPromptReset" : "sellerPromptReset"),
    );
  };

  const handleCopy = async (type: string) => {
    try {
      await navigator.clipboard.writeText(systemPrompts[type]);
      setCopied((prev) => ({ ...prev, [type]: true }));
      toast(t("success"), {
        description: t("promptCopySuccess"),
      });
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (err) {
      toast(t("error"), {
        description: t("promptCopyFailed"),
      });
    }
  };

  const getCharacterCount = (text: string) => text.length;
  const getWordCount = (text: string) =>
    text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t("promptEditingTitle")}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t("promptEditingDescription")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <Badge variant="outline" className="gap-1">
                <MessageSquare size={12} />
                {t("activePrompts")}: {prompts.length}
              </Badge>
            )}
            <Badge
              variant={
                hasChanges.renter || hasChanges.seller
                  ? "destructive"
                  : "secondary"
              }
            >
              {hasChanges.renter || hasChanges.seller
                ? t("unsavedChanges")
                : t("allSaved")}
            </Badge>
          </div>

          <Separator />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-[400px]" />
            <Card>
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
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="renter" className="gap-2">
                <User size={16} />
                {t("renter_buyer")}
                {hasChanges.renter && (
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                )}
              </TabsTrigger>
              <TabsTrigger value="seller" className="gap-2">
                <Building2 size={16} />
                {t("seller_agency")}
                {hasChanges.seller && (
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="renter" className="space-y-6">
              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <User className="w-5 h-5 text-primary" />
                        {t("renter_buyer_prompt")}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {t("renter_buyer_promptDescription")}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="gap-2"
                      >
                        {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showPreview ? t("hide") : t("preview")}
                      </Button>
                    </div>
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
                          {getCharacterCount(systemPrompts.renter)}
                          {t("characters")}
                        </span>
                      </div>
                    </div>

                    {showPreview ? (
                      <div className="bg-muted/50 border rounded-lg p-4 min-h-[300px]">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          <Markdown
                            options={{
                              overrides: MarkdownComponents,
                            }}
                            className="text-sm whitespace-pre-wrap break-words"
                          >
                            {systemPrompts.renter}
                          </Markdown>
                        </div>
                      </div>
                    ) : (
                      <Textarea
                        id="renter-prompt"
                        value={systemPrompts.renter}
                        onChange={(e) =>
                          handlePromptChange("renter", e.target.value)
                        }
                        className="min-h-[300px] text-sm leading-relaxed font-mono resize-none"
                        placeholder="Enter the AI prompt for renter/buyer assistance..."
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      {hasChanges.renter && (
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-600/50"
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
                      >
                        {copied.renter ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                        {copied.renter ? t("copied") : t("copy")}
                      </Button>

                      {hasChanges.renter && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReset("renter")}
                          className="gap-2"
                        >
                          <RefreshCw size={14} />
                          {t("reset")}
                        </Button>
                      )}

                      <Button
                        onClick={() => handleSave("renter")}
                        disabled={!hasChanges.renter}
                        size="sm"
                        className="gap-2"
                      >
                        <Save size={14} />
                        {t("saveChanges")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seller" className="space-y-6">
              <Card className="shadow-sm border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Building2 className="w-5 h-5 text-primary" />
                        {t("seller_agency_prompt")}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {t("seller_agency_promptDescription")}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                        className="gap-2"
                      >
                        {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showPreview ? t("hide") : t("preview")}
                      </Button>
                    </div>
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
                      <div className="bg-muted/50 border rounded-lg p-4 min-h-[300px]">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          <Markdown
                            options={{
                              overrides: MarkdownComponents,
                            }}
                            className="text-sm whitespace-pre-wrap break-words"
                          >
                            {systemPrompts.seller}
                          </Markdown>
                        </div>
                      </div>
                    ) : (
                      <Textarea
                        id="seller-prompt"
                        value={systemPrompts.seller}
                        onChange={(e) =>
                          handlePromptChange("seller", e.target.value)
                        }
                        className="min-h-[300px] text-sm leading-relaxed font-mono resize-none"
                        placeholder="Enter the AI prompt for seller/agency assistance..."
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      {hasChanges.seller && (
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-600/50"
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
                      >
                        {copied.seller ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                        {copied.seller ? t("copied") : t("copy")}
                      </Button>

                      {hasChanges.seller && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReset("seller")}
                          className="gap-2"
                        >
                          <RefreshCw size={14} />
                          {t("reset")}
                        </Button>
                      )}

                      <Button
                        onClick={() => handleSave("seller")}
                        disabled={!hasChanges.seller}
                        size="sm"
                        className="gap-2"
                      >
                        <Save size={14} />
                        {t("saveChanges")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {(hasChanges.renter || hasChanges.seller) && (
          <Card className="mt-6 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-amber-900 dark:text-amber-100">
                      {t("haveUnsavedChanges")}
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {t("saveYourChanges")}
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
                    className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950"
                  >
                    {t("resetAll")}
                  </Button>
                  <Button
                    onClick={() => {
                      if (hasChanges.renter) handleSave("renter");
                      if (hasChanges.seller) handleSave("seller");
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
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
