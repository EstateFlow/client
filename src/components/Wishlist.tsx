import { useEffect } from "react";
import { useWishlistStore } from "@/store/wishlist";
import { Button } from "@/components/ui/button";

export function WishlistPage() {
  const { wishlist, loading, loadWishlist, removeProperty  } = useWishlistStore();

  useEffect(() => {
    loadWishlist();
  }, []);

  if (loading) return <div className="p-4">Loading wishlist...</div>;

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
          <p className="text-sm font-semibold mt-2">{property.price} {property.currency}</p>
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
