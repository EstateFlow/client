import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, HeartMinus, MapPin, Home, Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { PropertyWishlist, Property } from "@/lib/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ListingFormToUpdate from "@/components/ListingFormToUpdate";
import { useState } from "react";

export default function OfferCardByOwner({
  ownerId,
  role,
  property,
  propertyWishlist,
  onRemove,
  onRefresh,
}: {
  ownerId: string;
  role: string;
  property?: Property;
  propertyWishlist?: PropertyWishlist;
  onRemove?: () => void;
  onRefresh: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);

  const formatPrice = (price: string, currency: any) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(Number(price));
  };

  console.log(propertyWishlist);

  switch (role) {
    case "admin":

    case "private_seller":
    case "agency":
      return (
        <div
          className={`overflow-hidden rounded-xl transition-shadow hover:shadow-md border border-border ${property?.status === "inactive" ? "bg-muted opacity-60 grayscale" : ""}`}
        >
          <div className="relative">
            <Link
              to="/listing-page"
              search={{ propertyId: property?.id ?? "" }}
              className="[&.active]:underline"
            >
              <img
                src={
                  property?.images.find((img) => img.isPrimary)?.imageUrl || ""
                }
                alt={property?.title}
                className="rounded-t-xl w-full h-48 object-cover bg-gray-100"
              />
            </Link>
            {property?.status === "active" && (
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-3 right-3 rounded-full bg-white shadow-md hover:scale-105 transition-transform z-10 cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  property?.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                {property?.status === "active" ? "Active" : "Inactive"}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full capitalize">
                {property?.transactionType}
              </span>
            </div>
          </div>
          <CardContent className="p-4 space-y-1">
            <div>
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {property?.title}
                </h3>
                <div className="text-sm flex gap-1 items-center text-muted-foreground">
                  {property?.views.length} <Eye className="w-4 h-4" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                {property?.description}
              </p>
            </div>

            <div className="text-sm mt-4 flex items-center justify-between">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin size={14} />
                <span className="line-clamp-1">{property?.address}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Home size={14} />
                <span>{property?.rooms || "N/A"} rooms</span>
              </div>
            </div>

            <div className="flex items-center gap-1 font-semibold text-lg justify-end">
              {formatPrice(property?.price || "0", property?.currency)}
            </div>
          </CardContent>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <ListingFormToUpdate
                ownerId={ownerId}
                propertyToEdit={property}
                onFinish={() => {
                  onRefresh();
                  setIsEditing(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      );
    case "renter_buyer":
      if (propertyWishlist?.status === "active") {
        return (
          <div className="overflow-hidden">
            <div className="relative p-2">
              <Link
                to="/listing-page"
                search={{ propertyId: propertyWishlist!.id }}
                className="[&.active]:underline"
              >
                <img
                  src={propertyWishlist?.images[0]}
                  alt={propertyWishlist?.title}
                  className="rounded-t-xl w-full h-48 object-cover bg-gray-100"
                />
              </Link>
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-3 right-3 rounded-full bg-white shadow-md hover:scale-105 transition-transform z-10"
                onClick={() => onRemove?.()}
              >
                <HeartMinus className="w-4 h-4 text-red-500" />
              </Button>
              <div className="absolute top-3 left-3 flex gap-2">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    propertyWishlist?.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                  }`}
                >
                  {property?.status === "active" ? "Active" : "Inactive"}
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full capitalize">
                  {propertyWishlist?.transactionType}
                </span>
              </div>
            </div>
            <CardContent className="p-4 space-y-1">
              <div>
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {propertyWishlist?.title}
                  </h3>
                  <div className="text-sm flex gap-1 items-center text-muted-foreground">
                    {propertyWishlist?.views.length} <Eye className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                  {propertyWishlist?.description}
                </p>
              </div>

              <div className="text-sm mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin size={14} />
                  <span className="line-clamp-1">
                    {propertyWishlist?.address}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Home size={14} />
                  <span>{propertyWishlist?.rooms || "N/A"} rooms</span>
                </div>
              </div>

              <div className="flex items-center gap-1 font-semibold text-lg justify-end">
                {formatPrice(
                  (propertyWishlist?.price).toString() || "0",
                  propertyWishlist?.currency,
                )}
              </div>
            </CardContent>
          </div>
        );
      }
      break;

    case "moderator":
    default:
  }
}
