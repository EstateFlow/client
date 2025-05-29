import OfferCarByOwner from "@/components/OfferCardByOwner";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, PlusCircle } from "lucide-react";
import { usePropertiesStore } from "@/store/usePropertiesStore";
import { useEffect } from "react";
import type { UserInfo } from "@/lib/types";
import { useWishlistStore } from "@/store/wishlist";
import { Link } from "@tanstack/react-router";

export default function OfferCardGridByOwner({ user }: { user: UserInfo }) {
  const { properties, loading: propertiesLoading, error, fetchAll } = usePropertiesStore();
  const { wishlist, loading: wishlistLoading, loadWishlist, removeProperty } = useWishlistStore();

  useEffect(() => {
    switch (user.role) {
      case "admin":
      case "private_seller":
        fetchAll("active");
        break;
      case "renter_buyer":
        loadWishlist();
        break;
      default:
        break;
    }
  }, [user.role]);

  // const handleAddNewListing = () => {
  //   alert("Redirect to create new listing page");
  // };
  const handleRefresh = () => {
    fetchAll("active");
  };
  const renderContent = () => {
    switch (user.role) {
      case "admin":
      case "private_seller":
        if (propertiesLoading) {
          return <div className="p-4 text-sm text-muted">Loading...</div>;
        }
        if (error) {
          return <div className="p-4 text-red-500">{error}</div>;
        }

        const filteredProperties = properties.filter(
          (property) => property.ownerId === user.userId
        );

        const canAddMore = filteredProperties.length < 5;

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProperties.map((property) => (
              <OfferCarByOwner ownerId={user.userId} key={property.id} role={user.role} property={property} onRefresh={handleRefresh} />
            ))}

            {user.role === "private_seller" && canAddMore ? (
              <Link
                to="/listing-form-to-add-page"
                search={{ userId: user.userId }}
                className="[&.active]:underline"
              >
              <Card
                className="overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition"
              >
                <div className="relative p-2">
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-md">
                    <PlusCircle className="w-10 h-10 text-muted-foreground" />
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex items-center justify-center text-center text-muted-foreground">
                  <p className="font-semibold">Add new listing</p>
                </CardContent>
              </Card>
              </Link>
            ) : user.role === "private_seller" ? (
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
            ) : null}
          </div>
        );

      case "renter_buyer":
        if (wishlistLoading) {
          return <div className="p-4">Loading wishlist...</div>;
        }

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {wishlist.map((property) => (
              <OfferCarByOwner
                ownerId={user.userId}
                key={property.id}
                role={user.role}
                propertyWishlist={property}
                onRemove={() => removeProperty(property.id)}
                onRefresh={handleRefresh}
              />
            ))}
          </div>
        );

      case "agency":
      case "moderator":
      default:
        return null;
    }
  };

  return renderContent();
}
