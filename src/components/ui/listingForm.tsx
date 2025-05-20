import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Share2, Heart } from "lucide-react";

export default function ListingForm() {
  const listing = {
    price: 40000,
    address: "Kharkiv, Nemyshlyanskyi District, Rybalko Street 30, ap. 11",
    area: "40m2",
    rooms: 2,
    description:
      "The space of the apartment is thought out to the smallest detail: a large panoramic window fills the room with natural light, and the warm, neutral tones of the interior create an atmosphere of peace and home comfort. Modern layout, comfortable seating area, functional furniture, built-in shelving and landscaping add not only aesthetics, but also practicality. An ideal option for a couple, a young family or for a rental business.",
    imageUrl: "https://surl.li/tsnybn",
    facilities: [
      "Heating",
      "Wi-Fi",
      "Conditioner",
      "Hot Water",
      "Washing Machine",
      "Pets allowed",
      "Dishwasher",
      "Fridge",
    ],
    location: {
      lat: 49.9808,
      lng: 36.2527,
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 grid gap-6">
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={listing.imageUrl}
          alt="Apartment"
          className="w-full rounded-2xl object-cover"
        />
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <CardTitle className="text-2xl">{listing.price}$</CardTitle>
              <CardDescription>{listing.address}</CardDescription>
              <div className="text-sm text-muted-foreground">
                Area: {listing.area} | {listing.rooms} rooms
              </div>
              <p className="text-sm leading-relaxed">{listing.description}</p>
              <div className="flex gap-2 pt-2">
                <Button variant="secondary">View seller's profile</Button>
                <Button variant="outline">
                  <Heart className="w-4 h-4 mr-1" /> Add to wishlist
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-1" /> Share
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
              src={`https://maps.google.com/maps?q=${listing.location.lat},${listing.location.lng}&z=15&output=embed`}
            ></iframe>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Facilities:</h2>
          <ul className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
            {listing.facilities.map((facility) => (
              <li key={facility}>• {facility}</li>
            ))}
          </ul>
          <Button className="mt-4 w-full text-base h-12 text-white">Rent Now</Button>
        </div>
      </div>
    </div>
  );
}
