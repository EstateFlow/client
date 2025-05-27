import OfferCarByOwner from "@/components/OfferCardByOwner";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { usePropertiesStore } from "@/store/usePropertiesStore";
import { useEffect } from "react";
import type { UserInfo } from "@/lib/types";
import { useWishlistStore } from "@/store/wishlist";

export default function OfferCardGridByOwner({ user }: { user: UserInfo}) {

  switch (user.role){
    case "admin":
    case "private_seller":
      const { properties, loading: propertiesLoading, error, fetchAll } = usePropertiesStore();
      useEffect(() => {
        fetchAll("active");
      }, []);

      if (propertiesLoading) return <div className="p-4 text-sm text-muted">Loading...</div>;
      if (error) return <div className="p-4 text-red-500">{error}</div>;

      const filteredProperties = user
      ? properties.filter((property) => property.ownerId === user.userId)
      : [];
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProperties.map((property) => (
            <OfferCarByOwner role = {user.role} property = {property}/>
          ))}
          {user.role === "private_seller" && (
                <Card className="overflow-hidden flex flex-col">
                  <div className="relative p-2">
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md">
                      <Building2 className="w-10 h-10 text-muted-foreground" />
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1 flex items-center justify-center text-center text-muted-foreground">
                    <p className="font-semibold">For more, extend to agency</p>
                  </CardContent>
                </Card>
              )}
        </div>
        );

    case "renter_buyer":
      
      const { wishlist, loading: wishlistLoading, loadWishlist, removeProperty  } = useWishlistStore();
      useEffect(() => {
        loadWishlist();
      }, []);
      if (wishlistLoading) return <div className="p-4">Loading wishlist...</div>;

      return (
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.map((property) => (
            <OfferCarByOwner role = {user.role} propertyWishlist = {property} onRemove={() => removeProperty(property.id)}/>
          ))}
        </div>
        );
    case "moderator":
    default:
  }
}
