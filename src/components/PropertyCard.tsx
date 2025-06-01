import { useEffect } from "react";
import { usePropertiesStore } from "@/store/usePropertiesStore";
import { CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Home, MapPin, Calendar, User } from "lucide-react";

export function PropertyCard({ property }: any) {
  const { properties, fetchAll } = usePropertiesStore();

  useEffect(() => {
    if (properties.length === 0) {
      fetchAll("active");
    }
  }, [properties.length, fetchAll]);

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: any, currency: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(Number(price));
  };

  return (
    <div
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
              property.images.filter((img: any) => img.isPrimary)[0].imageUrl ||
              "https://via.placeholder.com/300x200"
            }
            alt={property.title}
            className="rounded-t-xl w-full h-48 object-cover bg-gray-100"
          />

          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full capitalize">
              {property.transactionType}
            </span>
          </div>
        </Link>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1">
            {property.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
            {property.description}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin size={14} />
            <span className="line-clamp-1">{property.address}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Home size={14} />
                <span>{property.rooms} rooms</span>
              </div>
              <span>{property.size}</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-lg">
              {formatPrice(property.price, property.currency)}
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <User size={14} />
            <span>{property.owner?.username}</span>
            <span>•</span>
            <Calendar size={14} />
            <span>{formatDate(property.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
