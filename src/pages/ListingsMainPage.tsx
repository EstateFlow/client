import { Input } from "@/components/ui/input";
import PropertyFilters from "@/components/PropertyFilters";
import { PropertyList } from "@/components/PropertyList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterStore } from "@/store/filterStore";

export default function ListingsMainPage() {
  const { sortBy, setSortBy, searchQuery, setSearchQuery } = useFilterStore();

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        {/* Левая часть: фильтры и поиск */}
        <div className="flex items-center gap-2">
          <PropertyFilters />
          <Input
            className="max-w-m"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Правая часть: сортировка */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">First new</SelectItem>
            <SelectItem value="expensive">First expensive</SelectItem>
            <SelectItem value="cheap">First cheap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PropertyList />
    </div>
  );
}