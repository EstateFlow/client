import { useEffect, useMemo } from "react";
import { usePropertiesStore } from "@/store/usePropertiesStore";
import { useFilterStore } from "@/store/filterStore";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

export function PropertyList() {
  const { properties, loading, error, fetchAll } = usePropertiesStore();
  const {
    price,
    area,
    rooms,
    types,
    searchQuery,
    sortBy,
  } = useFilterStore();

  useEffect(() => {
    fetchAll("active");
  }, []);

  // Фильтрация + поиск + сортировка
  const filteredProperties = useMemo(() => {
    let result = properties;

    result = result.filter((property) => {
      if (Number(property.price) > price[1]) return false;
      if (Number(property.size) > area[1]) return false;
      if (rooms.length > 0 && !rooms.includes(Number(property.rooms))) return false;
      if (
        types.length > 0 &&
        !types.includes(property.transactionType.toLowerCase())
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
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
} else if (sortBy === "expensive") {
  result = [...result].sort(
    (a, b) => Number(b.price) - Number(a.price)
  );
} else if (sortBy === "cheap") {
  result = [...result].sort(
    (a, b) => Number(a.price) - Number(b.price)
  );
}


    return result;
  }, [properties, price, area, rooms, types, searchQuery, sortBy]);

  if (loading) return <div className="p-4 text-sm text-muted">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {filteredProperties.map((property) => (
        <Card
          key={property.id}
          className={`rounded-xl flex flex-col p-0 overflow-hidden ${
            property?.status === "inactive" ? "bg-muted opacity-60 grayscale" : ""
          }`}
        >
          <div className="relative p-2">
            <Link
              to="/listing-page"
              search={{ propertyId: property.id }}
              className="[&.active]:underline"
            >
              <img
                src={
                  property.images.find((img) => img.isPrimary)?.imageUrl || ""
                }
                alt={property.title}
                className="rounded-t-xl w-full h-48 object-cover bg-gray-100"
              />
            </Link>
          </div>

          <CardContent className="p-4 space-y-1">
            <h3 className="text-base font-semibold truncate">
              {property.title}
            </h3>
            <h4 className="text-sm text-muted-foreground truncate">
              {property.address}
            </h4>
            <p className="text-muted-foreground">{property.transactionType}</p>
            <p className="font-semibold">
              {property.price} {property.currency}
            </p>
          </CardContent>
        </Card>
      ))}

      {filteredProperties.length === 0 && properties.length > 0 && (
        <div className="col-span-full text-center p-8 text-muted-foreground">
          There are no such listings.
        </div>
      )}
    </div>
  );
}
