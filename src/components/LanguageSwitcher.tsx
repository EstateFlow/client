import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import "../i18n";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const [language, setLanguage] = useState<string>("EN");

  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    setLanguage(lng.toUpperCase());
    i18n.changeLanguage(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 rounded-full px-3 hover:bg-accent/50 transition-colors"
        >
          <Globe size={14} />
          <span className="text-xs font-medium">{language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          <Globe size={14} />
          <span className="text-xs font-medium">EN</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("ua")}>
          <Globe size={14} />
          <span className="text-xs font-medium">UA</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
