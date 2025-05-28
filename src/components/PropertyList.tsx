import { useEffect, useState } from "react";
import { usePropertiesStore } from "@/store/usePropertiesStore";
import { Card, CardContent } from "@/components/ui/card";
// import { Heart, HeartOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { addToWishlist, removeFromWishlist } from "@/api/wishlist";
import { Link } from "@tanstack/react-router";

export function PropertyList() {
  const { properties, loading, error, fetchAll } = usePropertiesStore();
  //const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAll("active");
  }, []);

  // const handleToggleWishlist = async (propertyId: string) => {
  //   try {
  //     if (wishlist[propertyId]) {
  //       await removeFromWishlist(propertyId);
  //       setWishlist((prev) => ({ ...prev, [propertyId]: false }));
  //     } else {
  //       await addToWishlist(propertyId);
  //       setWishlist((prev) => ({ ...prev, [propertyId]: true }));
  //     }
  //   } catch (err) {
  //     console.error("Wishlist error:", err);
  //   }
  // };

  if (loading) return <div className="p-4 text-sm text-muted">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {properties.map((property) => (
        <Card
          key={property.id}
          className={`overflow-hidden rounded-xl transition-shadow hover:shadow-md border ${property.status === "inactive" ? "bg-muted opacity-60 grayscale" : "border-gray-200 hover:border-gray-300"}`}
        >
          <div className="relative p-2">
            <Link
              to="/listing-page"
              search={{ propertyId: property.id }}
              className="[&.active]:underline"
            >
              <img
                src={property.images.find((img) => img.isPrimary)?.imageUrl || ""}
                alt={property.title}
                className="rounded-t-xl w-full h-48 object-cover bg-gray-100"
              />
            </Link>

            {/* <Button
              variant="secondary"
              size="icon"
              className="absolute top-3 right-3 rounded-full bg-white shadow-md hover:scale-105 transition-transform z-10"
              onClick={() => handleToggleWishlist(property.id)}
            >
              {wishlist[property.id] ? (
                <HeartOff className="text-red-500 w-4 h-4" />
              ) : (
                <Heart className="text-gray-600 w-4 h-4" />
              )}
            </Button> */}
          </div>

          <CardContent className="p-4 space-y-1">
            <h3 className="text-base font-semibold truncate">{property.title}</h3>
            <h4 className="text-sm text-muted-foreground truncate">{property.address}</h4>
            <p className="text-muted-foreground">{property.transactionType}</p>
            <p className="font-semibold">{property.price} {property.currency}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}