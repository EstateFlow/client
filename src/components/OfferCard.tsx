// components/OfferCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, HeartMinus } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Offer = {
  id: string;
  address: string;
  type: string;
  price: number;
  imageUrl: string;
};

export default function OfferCard({ offer, role }: { offer: Offer; role: string}) {

  switch (role) {
    case "admin":
    case "seller":
          return (
    <Card className="overflow-hidden">
      <div className="relative p-2">    
        <img
          src={offer.imageUrl}
          alt=""
          className="rounded-md w-full h-40 object-contain bg-gray-100"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-5 right-3 rounded-full z-10"
        >
          <Link to="/listing-page" className="[&.active]:underline">
            <Pencil className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <CardContent className="p-4">
        <h4 className="font-bold text-lg">{offer.address}</h4>
        <p className="text-muted-foreground">{offer.type}</p>
        <p className="font-semibold">{offer.price.toLocaleString()} $</p>
      </CardContent>
    </Card>
  );  
    case "renter_buyer":
      return (
    <Card className="overflow-hidden">
      <div className="relative p-2">           
        <Link to="/listing-page" className="[&.active]:underline">   
        <img
          src={offer.imageUrl}
          alt=""
          className="rounded-md w-full h-40 object-contain bg-gray-100"
        />          
        </Link>
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 rounded-full z-100 bg-white"
        >


            <HeartMinus className="w-4 h-4 text-red-500" />

        </Button>
      </div>
      <CardContent className="p-4">
        <h4 className="font-bold text-lg">{offer.address}</h4>
        <p className="text-muted-foreground">{offer.type}</p>
        <p className="font-semibold">{offer.price.toLocaleString()} $</p>
      </CardContent>
    </Card>
  );
    case "moderator":
    default:

  }
}
