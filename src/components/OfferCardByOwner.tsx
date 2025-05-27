import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, HeartMinus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { PropertyWishlist, Property } from "@/lib/types";
//import { useTempStore } from "@/store/tempStore";


export default function OfferCardByOwner({ role, property, propertyWishlist ,onRemove}: { role: string; property?: Property; propertyWishlist?:  PropertyWishlist; onRemove?: () => void;}) {
  switch (role) {
    case "admin":

    case "private_seller":
      // const setTempProperty = useTempStore((s) => s.setTempProperty);
      return (
        <Card className={`overflow-hidden rounded-xl transition-shadow hover:shadow-md border ${property?.status === "inactive" ? "bg-muted opacity-60 grayscale" : "border-gray-200 hover:border-gray-300"}`}>
          <div className="relative p-2">    
            <img
              src={property?.images.find((img) => img.isPrimary)?.imageUrl || ""}
              alt={property?.title}
              className="rounded-t-xl w-full h-48 object-cover bg-gray-100"
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-3 right-3 rounded-full bg-white shadow-md hover:scale-105 transition-transform z-10"
            >
            <Link to="/listing-page"
                search = {{role, propertyId : property!.id }}
              // onClick={() => {
              //   if (property) setTempProperty(property);
              // }}
              className="[&.active]:underline">   
                <Pencil className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <CardContent className="p-4 space-y-1">
              <h3 className="text-base font-semibold truncate">{property?.title}</h3>
              <h4 className="text-sm text-muted-foreground truncate">{property?.address}</h4>
            <p className="text-muted-foreground">{property?.transactionType}</p>
            <p className="font-semibold">{property?.price} $</p>
          </CardContent>
        </Card>
      );  
    case "renter_buyer":
        //const setTempWishlist = useTempStore((s) => s.setTempWishlist);
      if(propertyWishlist?.status === "active"){   
        return (
          <Card className="overflow-hidden">
            <div className="relative p-2">           
              <Link to="/listing-page"
                search = {{role, propertyId : propertyWishlist!.id}}
                //  onClick={() => setTempWishlist(propertyWishlist)}
              className="[&.active]:underline">   
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
            </div>
            <CardContent className="p-4 space-y-1">
              <h3 className="text-base font-semibold truncate">{propertyWishlist?.title}</h3>
              <h4 className="text-sm text-muted-foreground truncate">{propertyWishlist?.address}</h4>
              <p className="text-muted-foreground">{propertyWishlist?.transactionType}</p>
              <p className="font-semibold">{propertyWishlist?.price} $</p>
            </CardContent>
          </Card>
        );
      }
      break;
      
    case "moderator":
    default:

  }
}
