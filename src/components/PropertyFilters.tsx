import { useEffect } from "react";
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
import { usePropertiesStore } from "@/store/usePropertiesStore";

export default function PropertyFilters() {
  const {
    price,
    area,
    rooms,
    types,
    setPrice,
    setArea,
    toggleRoom,
    toggleType,
  } = useFilterStore();
  
  const { properties } = usePropertiesStore();

  // Инициализируем максимальные значения на основе данных
  useEffect(() => {
    if (properties.length > 0) {
      const maxPrice = Math.max(...properties.map(p => Number(p.price) || 0));
      const maxArea = Math.max(...properties.map(p => Number(p.size) || 0));
      
      // Устанавливаем максимальные значения только если они еще не установлены
      if (price[1] === 0) {
        setPrice([0, maxPrice]);
      }
      if (area[1] === 0) {
        setArea([0, maxArea]);
      }
    }
  }, [properties, price, area, setPrice, setArea]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost">
          <Menu className="w-5 h-5" />
          {/* Показываем индикатор активных фильтров */}
          {(types.length > 0 || rooms.length > 0) && (
            <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Filters</h1>
        </div>

        <div>
          <h2 className="font-bold mb-2">Price</h2>
          <Slider
            min={0}
            max={Math.max(...properties.map(p => Number(p.price) || 0)) || 100000}
            step={1000}
            value={[price[1]]}
            onValueChange={(val) => setPrice([0, val[0]])}
          />
          <div className="text-sm mt-1">Up to {price[1].toLocaleString()} $</div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Square (m²)</h2>
          <Slider
            min={0}
            max={Math.max(...properties.map(p => Number(p.size) || 0)) || 200}
            step={5}
            value={[area[1]]}
            onValueChange={(val) => setArea([0, val[0]])}
          />
          <div className="text-sm mt-1">Up to {area[1]} м²</div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Rooms</h2>
          <div className="flex gap-4 flex-wrap">
            {[1, 2, 3, 4, 5].map((room) => (
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

        <div>
          <h2 className="font-bold mb-2">Transaction Type</h2>
          <div className="flex gap-4">
            {["sale", "rent"].map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  checked={types.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                />
                <span className="capitalize">
                  {type === "sale" ? "Sale" : "Rent"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}