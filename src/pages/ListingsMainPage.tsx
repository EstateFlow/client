import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { create } from "zustand";
import listing1 from '@/assets/images/listing1.jpg';
import { Menu } from "lucide-react";
import PropertyFilters from "@/components/PropertyFilters";

interface Property {
  id: number;
  image: string;
  address: string;
  price: string;
  type: string;
}

interface PropertyState {
  properties: Property[];
  page: number;
  setPage: (page: number) => void;
  setProperties: (props: Property[]) => void;
}

const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  page: 1,
  setPage: (page) => set({ page }),
  setProperties: (props) => set({ properties: props }),
}));

const TOTAL_PAGES = 4;

export default function PropertyGrid() {
  const { properties, page, setPage, setProperties } = usePropertyStore();

  useEffect(() => {
    const dummyData: Property[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      image: listing1,
      address: "123 Main St, New York, NY 10001",
      price: "1500 $",
      type: "rent",
    }));
    setProperties(dummyData);
  }, [setProperties]);

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2 mb-6">
  <PropertyFilters />
        <Input className="max-w-sm" placeholder="Search" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {properties.map((prop) => (
          <Card key={prop.id} className="rounded-xl flex flex-col p-0 overflow-hidden">
  <Link to="/listing-page" className="block [&.active]:underline">
    <img
      src={prop.image}
      alt="room"
      className="w-full h-50 object-cover"
    />
  </Link>
  <CardContent className="p-4">
    <div className="font-semibold text-sm">{prop.address}</div>
    <div className="text-xs text-muted-foreground">{prop.type}</div>
    <div className="text-xl font-extrabold text-primary">{prop.price}</div>
  </CardContent>
</Card>

        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <Button variant="outline" onClick={() => setPage(Math.max(1, page - 1))}>
          &lt;
        </Button>
        {[...Array(TOTAL_PAGES)].map((_, i) => (
          <Button
            key={i}
            variant={page === i + 1 ? "default" : "outline"}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button variant="outline" onClick={() => setPage(Math.min(TOTAL_PAGES, page + 1))}>
          &gt;
        </Button>
      </div>
    </div>
  );
}