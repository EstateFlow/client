// components/OfferCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";


type Offer = {
  id: string;
  address: string;
  type: string;
  price: number;
  imageUrl: string;
};

export default function OfferCard({ offer }: { offer: Offer }) {
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
          className="absolute top-3 right-3 rounded-full z-10"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </div>
      <CardContent className="p-4">
        <h4 className="font-bold text-lg">{offer.address}</h4>
        <p className="text-muted-foreground">{offer.type}</p>
        <p className="font-semibold">{offer.price.toLocaleString()} $</p>
      </CardContent>
    </Card>
  );
}
