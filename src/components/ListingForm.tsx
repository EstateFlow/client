import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Share2, Heart, HeartOff } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePropertiesStore } from "@/store/usePropertiesStore";
import { useWishlistStore } from "@/store/wishlist";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { $api } from "@/api/BaseUrl";

export default function ListingForm({ propertyId }: { propertyId: string }) {
  const { selectedProperty, fetchById, loading, error } = usePropertiesStore();
  const { wishlist, loadWishlist, addProperty, removeProperty } =
    useWishlistStore();
  const { isAuthenticated } = useAuthStore(); // <--- добавим user
  const { user } = useUserStore();
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="max-w-5xl w-full mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="grid gap-2 w-full justify-items-center md:grid-cols-2 mb-4">
            <div className="bg-card rounded-lg border p-4 space-y-4 h-100 w-full"></div>
            <div className="bg-card rounded-lg border p-4 space-y-4 h-100 w-full">
              <div className="bg-muted rounded w-2/4 h-8 mb-2"></div>
              <div className="space-y-2 mb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
              <div className="h-40 bg-muted rounded"></div>
              <div className="flex gap-2">
                <div className="h-10 bg-muted rounded w-1/3"></div>
                <div className="h-10 bg-muted rounded w-1/4"></div>
              </div>
            </div>
          </div>
          <div className="h-60 bg-card rounded"></div>
        </div>
      </div>
    );
  }

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

    if (user?.role !== "renter_buyer") {
      toast("Access restricted", {
        description: "Please sign in as a buyer to use this feature.",
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

  const styles = {
    color: "black" as const,
    layout: "vertical" as const,
    size: "medium" as const,
    label: "pay" as const,
  };

  const onCreateOrder = async () => {
    try {
      const price = parseFloat(selectedProperty.price);
      if (isNaN(price)) {
        toast.error("Invalid price format. Please contact support.");
        throw new Error("Invalid price format");
      }

      const amount =
        selectedProperty.transactionType === "sale"
          ? (price * 0.1).toFixed(2)
          : price.toFixed(2);

      const response = await $api.post(
        `${import.meta.env.VITE_API_URL}/api/paypal/create-order`,
        {
          amount,
          item: {
            name: selectedProperty.title,
            description: selectedProperty.description,
            sku: selectedProperty.id,
          },
        },
      );
      return response.data.id;
    } catch (error) {
      toast.error("Failed to create PayPal order. Please try again.");
      throw new Error("Failed to create PayPal order");
    }
  };

  const onApprove = async (data: any) => {
    try {
      if (!data?.orderID) {
        toast.error("Invalid order ID. Please try again.");
        return;
      }

      const response = await $api.post(
        `${import.meta.env.VITE_API_URL}/api/paypal/capture-order`,
        {
          orderId: data?.orderID,
          email: user?.email,
        },
      );
      console.log(response);
      navigate({ to: "/complete-payment" });
    } catch (error) {
      toast.error("Failed to capture payment. Please try again.");
      console.error(error);
    }
  };

  const onError = async (data: any) => {
    console.log(data);
    navigate({ to: "/cancel-payment" });
  };
  const handleShare = async () => {
  const shareUrl = `${window.location.origin}/listing-page?propertyId=${propertyId}`;
  const shareData = {
    title: selectedProperty.title,
    text: selectedProperty.description,
    url: shareUrl,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error("Sharing failed:", err);
      toast.error("Sharing failed");
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  }
};

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
          <Card className="relative">
            {/* Wishlist button в правом верхнем углу */}
            <Button
              variant={isWished ? "destructive" : "outline"}
              onClick={handleToggleWishlist}
              className="absolute top-4 right-4 z-10"
              size="sm"
            >
              {isWished ? (
                <>
                  <HeartOff className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4" />
                </>
              )}
            </Button>

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

                <Button variant="outline" onClick={handleShare}>
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
          <PayPalButtons
            createOrder={onCreateOrder}
            onApprove={onApprove}
            onError={onError}
            style={styles}
            className="mt-4"
            fundingSource="paypal"
          />
        </div>
      </div>
    </div>
  );
}
