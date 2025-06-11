import { PropertyList } from "@/components/PropertyList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortAsc, Star, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import { SearchBar } from "@/components/SearchBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { useTranslation } from "react-i18next";

export default function ListingsMainPage() {
  const { t } = useTranslation();
  const { sortBy, setSortBy } = useFilterStore();

  return (
    <div className="p-4 flex flex-col md:flex-row gap-4">
      <FilterSidebar />

      <div className="flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 flex-1">
            <SearchBar />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <SortAsc className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">
                {t("sortBy")}:
              </span>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px] h-11 focus:ring-2 focus:ring-blue-100 bg-gray-50 transition-all duration-200">
                <SelectValue placeholder="Choose sorting" />
              </SelectTrigger>
              <SelectContent className="w-[200px]">
                <SelectItem
                  value="newest"
                  className="flex items-center gap-2 py-3"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{t("newestFirst")}</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="expensive"
                  className="flex items-center gap-2 py-3"
                >
                  <div className="flex items-center gap-2 w-full">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>{t("priceHigh")}</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="cheap"
                  className="flex items-center gap-2 py-3"
                >
                  <div className="flex items-center gap-2 w-full">
                    <TrendingDown className="h-4 w-4 text-orange-500" />
                    <span>{t("priceLow")}</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="featured"
                  className="flex items-center gap-2 py-3"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{t("featuredProperties")}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <PropertyList />
      </div>
    </div>
  );
}
