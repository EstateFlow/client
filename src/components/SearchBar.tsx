import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useFilterStore();

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
      <Input
        className="px-10"
        placeholder="Search properties"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center
                          text-gray-400 hover:text-gray-600 dark:text-gray-500 
                          dark:hover:text-gray-300 transition-colors duration-200"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
