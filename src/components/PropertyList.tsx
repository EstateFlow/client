import { useEffect, useMemo } from "react";
import { usePropertiesStore } from "@/store/usePropertiesStore";
import { useFilterStore } from "@/store/filterStore";
import { PropertyCard } from "./PropertyCard";

export function PropertyList() {
  const { properties, loading, error, fetchAll } = usePropertiesStore();
  const { price, area, rooms, types, propertyTypes, searchQuery, sortBy } =
    useFilterStore();

  useEffect(() => {
    if (properties.length === 0) {
      fetchAll("active");
    }
  }, [properties.length, fetchAll]);

  // Фильтрация + поиск + сортировка
  const filteredProperties = useMemo(() => {
    let result = properties;

    result = result.filter((property) => {
      if (price[0] > 0 && Number(property.price) < price[0]) return false; // Min price
      if (price[1] > 0 && Number(property.price) > price[1]) return false; // Max price
      if (area[0] > 0 && Number(property.size) < area[0]) return false; // Min area
      if (area[1] > 0 && Number(property.size) > area[1]) return false; // Max area
      if (rooms.length > 0 && !rooms.includes(Number(property.rooms)))
        return false;
      if (
        types.length > 0 &&
        !types.includes(property.transactionType.toLowerCase())
      )
        return false;
      if (
        propertyTypes.length > 0 &&
        !propertyTypes.includes(property.propertyType?.toLowerCase() || "")
      )
        return false;

      if (
        searchQuery.trim() &&
        !property.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    });

    if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    } else if (sortBy === "expensive") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "cheap") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    }

    return result;
  }, [
    properties,
    price,
    area,
    rooms,
    types,
    propertyTypes,
    searchQuery,
    sortBy,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg border p-4 space-y-4"
                >
                  <div className="h-50 bg-muted rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
      {filteredProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}

      {filteredProperties.length === 0 && properties.length > 0 && (
        <div className="col-span-full text-center p-8 text-muted-foreground">
          There are no such listings.
        </div>
      )}
    </div>
  );
}
