import { useEffect, useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Home, MapPin, Calendar, User } from "lucide-react";
import { fetchUserById } from "@/api/BaseUrl";

interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: string;
  transactionType: string;
  price: number;
  currency: string;
  size: number;
  rooms: number;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  images?: { imageUrl: string }[];
  owner?: { username: string };
}

interface SellerPropertiesProps {
  userId: string;
}

export function SellerProperties({ userId }: SellerPropertiesProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchUserById(userId)
      .then((res) => {
        console.log("API Response:", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Error during user loading:", err);
        setError("Failed to load properties. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(Number(price));
  };

  const saleProperties =
    user?.properties?.filter(
      (property: Property) =>
        property.transactionType === "sale" && property.status === "active",
    ) || [];

  console.log(user?.properties[0].status);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
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
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Properties for Sale</h2>
      {saleProperties.length === 0 ? (
        <p className="text-muted-foreground">No properties for sale.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {saleProperties.map((property: Property) => (
            <div
              key={property.id}
              className="rounded-xl flex flex-col p-0 overflow-hidden shadow-md"
            >
              <div className="relative p-2">
                <Link
                  to="/listing-page"
                  search={{ propertyId: property.id }}
                  className="[&.active]:underline"
                >
                  <img
                    src={
                      property.images?.[0]?.imageUrl ||
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
                      <span>{property.size} sq ft</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-lg">
                      {formatPrice(property.price, property.currency)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User size={14} />
                    <span>{user?.username || "Unknown"}</span>
                    <span>•</span>
                    <Calendar size={14} />
                    <span>{formatDate(property.createdAt)}</span>
                  </div>
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
