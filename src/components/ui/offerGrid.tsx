// components/OfferGrid.tsx
import OfferCard from "@/components/ui/offerCard";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
type Offer = {
  id: string;
  address: string;
  type: string;
  price: number;
  imageUrl: string;
};

export default function OfferGrid({ offers, role }: { offers: Offer[]; role: string }) {
return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} role = {role} />
      ))}
      
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
    </div>
  );
}
