import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Share2, Heart, HeartOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePropertiesStore } from "@/store/usePropertiesStore";
import { useWishlistStore } from "@/store/wishlist";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";

export default function ListingForm({
  propertyId,
}: {
  propertyId: string;
}) {
  const { selectedProperty, fetchById, loading, error } = usePropertiesStore();
  const { wishlist, loadWishlist, addProperty, removeProperty } = useWishlistStore();
  const { isAuthenticated } = useAuth();

  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    fetchById(propertyId);
  }, [propertyId]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedProperty?.images?.length) {
      const defaultImage =
        selectedProperty.images.find((img) => img.isPrimary)?.imageUrl ||
        selectedProperty.images[0].imageUrl;
      setActiveImage(defaultImage);
    }
  }, [selectedProperty]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!selectedProperty) return <p>No property found</p>;

  const isWished = wishlist.some((p) => p.id === propertyId);

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast("You must be logged in to add to wishlist", {
        description: "Please log in or sign up to continue.",
      });
      return;
    }
    isWished ? removeProperty(propertyId) : addProperty(propertyId);
  };

  const facilities =
    selectedProperty.facilities
      ?.split(",")
      .map((f) => f.trim())
      .filter(Boolean) || [];
      return (
        <div className="max-w-5xl mx-auto px-4 py-6 grid gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Image viewer */}
            <div className="flex flex-col gap-2">
              <img
                src={activeImage}
                alt={selectedProperty.title}
                className="w-full h-[400px] rounded-2xl object-cover"
              />
              <div className="flex gap-2 overflow-x-auto">
                {selectedProperty.images.map((img) => (
                  <img
                    key={img.id}
                    src={img.imageUrl}
                    alt="thumbnail"
                    className={`w-20 h-20 rounded-lg object-cover cursor-pointer border-2 ${
                      activeImage === img.imageUrl
                        ? "border-black"
                        : "border-transparent"
                    }`}
                    onClick={() => setActiveImage(img.imageUrl)}
                  />
                ))}
              </div>
            </div>

            {/* Info panel */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <CardTitle className="text-2xl">
                    {selectedProperty.price}$
                  </CardTitle>
                  <CardDescription>{selectedProperty.address}</CardDescription>
                  <div className="text-sm text-muted-foreground">
                    Area: {selectedProperty.size} | {selectedProperty.rooms} rooms
                  </div>
                  <p className="text-sm leading-relaxed">
                    {selectedProperty.description}
                  </p>

                  <div className="flex gap-2 pt-2 flex-wrap">
                    <Link
                      to="/user-profile-page"
                      search={{ userId: selectedProperty.ownerId }}
                      className="[&.active]:underline"
                    >
                      <Button variant="secondary">View seller's profile</Button>
                    </Link>

                    <Button
                      variant={isWished ? "destructive" : "outline"}
                      onClick={handleToggleWishlist}
                    >
                      {isWished ? (
                        <>
                          <HeartOff className="w-4 h-4 mr-1" />
                          Remove from wishlist
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 mr-1" />
                          Add to wishlist
                        </>
                      )}
                    </Button>

                    <Button variant="outline">
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <h2 className="text-lg font-semibold mb-2">Where you will live:</h2>
              <iframe
                width="100%"
                height="300"
                className="rounded-2xl"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedProperty.address)}&z=15&output=embed`}
              ></iframe>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Facilities:</h2>
              <ul className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
                {facilities.map((facility) => (
                  <li key={facility}>• {facility}</li>
                ))}
              </ul>
              <Button className="mt-4 w-full text-base h-12 text-white">
                Rent Now
              </Button>
            </div>
          </div>
        </div>
      );
}
