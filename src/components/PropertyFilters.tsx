import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Menu } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";

export default function PropertyFilters() {
  const { price, area, rooms, setPrice, setArea, toggleRoom } = useFilterStore();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost">
          <Menu className="w-5 h-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 space-y-6">
        <div>
          <h2 className="font-bold mb-2">Price</h2>
          <Slider
            min={0}
            max={100000}
            step={1000}
            defaultValue={[price[1]]}
            onValueChange={(val) => setPrice([0, val[0]])}
          />
          <div className="text-sm mt-1">Up to {price[1]} $</div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Area (m²)</h2>
          <Slider
            min={0}
            max={200}
            step={5}
            defaultValue={[area[1]]}
            onValueChange={(val) => setArea([0, val[0]])}
          />
          <div className="text-sm mt-1">Up to {area[1]} m²</div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Rooms</h2>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((room) => (
              <div key={room} className="flex items-center gap-2">
                <Checkbox
                  checked={rooms.includes(room)}
                  onCheckedChange={() => toggleRoom(room)}
                />
                <span>{room}</span>
              </div>
            ))}
          </div>
        </div>
        <Button className="w-full" onClick={() => {/* TODO: apply filters */}}>
          Apply Filters
        </Button>
      </DrawerContent>
    
    </Drawer>
  );
}