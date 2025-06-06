import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { Button } from "@/components/ui/button";

export function WishlistPage() {
  const { wishlist, loading, loadWishlist, removeProperty } =
    useWishlistStore();

  useEffect(() => {
    loadWishlist();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg border p-4 space-y-4"
                >
                  <div className="h-40 bg-muted rounded"></div>
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {wishlist.map((property) => (
        <div key={property.id} className="border rounded-xl p-4 shadow">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-40 object-cover mb-2 rounded"
          />
          <h3 className="text-lg font-bold">{property.title}</h3>
          <p className="text-sm">{property.description}</p>
          <p className="text-sm font-semibold mt-2">
            {property.price} {property.currency}
          </p>
          <Button
            variant="destructive"
            className="mt-2"
            onClick={() => removeProperty(property.id)}
          >
            Remove from Wishlist
          </Button>
        </div>
      ))}
    </div>
  );
}
