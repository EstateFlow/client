import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";

export function FilterSidebar() {
  const {
    price,
    setPrice,
    area,
    setArea,
    rooms,
    toggleRoom,
    types,
    toggleType,
    propertyTypes,
    togglePropertyType,
  } = useFilterStore();
  const [isOpen, setIsOpen] = useState(false);

  const transactionTypes = ["sale", "rent"];
  const propertyTypeOptions = ["apartment", "house"];

  const handlePriceChange = (index: number, value: string) => {
    const newPrice = [...price];
    newPrice[index] = Number(value) || 0;
    setPrice(newPrice as [number, number]);
  };

  const handleAreaChange = (index: number, value: string) => {
    const newArea = [...area];
    newArea[index] = Number(value) || 0;
    setArea(newArea as [number, number]);
  };

  return (
    <>
      <div className="hidden md:block w-64 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Price Range</h4>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={price[0] || ""}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="h-9"
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max"
                value={price[1] || ""}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Area (sq ft)</h4>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={area[0] || ""}
                onChange={(e) => handleAreaChange(0, e.target.value)}
                className="h-9"
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max"
                value={area[1] || ""}
                onChange={(e) => handleAreaChange(1, e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Rooms</h4>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5].map((room) => (
                <div key={room} className="flex items-center space-x-2">
                  <Checkbox
                    id={`room-${room}`}
                    checked={rooms.includes(room)}
                    onCheckedChange={() => toggleRoom(room)}
                  />
                  <label htmlFor={`room-${room}`} className="text-sm">
                    {room} {room === 1 ? "Room" : "Rooms"}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Transaction Type</h4>
            <div className="grid grid-cols-2 gap-2">
              {transactionTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={types.includes(type)}
                    onCheckedChange={() => toggleType(type)}
                  />
                  <label
                    htmlFor={`type-${type}`}
                    className="text-sm capitalize"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Property Type</h4>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypeOptions.map((propertyType) => (
                <div key={propertyType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`property-${propertyType}`}
                    checked={propertyTypes.includes(propertyType)}
                    onCheckedChange={() => togglePropertyType(propertyType)}
                  />
                  <label
                    htmlFor={`property-${propertyType}`}
                    className="text-sm capitalize"
                  >
                    {propertyType}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <DrawerHeader>
              <DrawerTitle>Filters</DrawerTitle>
            </DrawerHeader>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={price[0] || ""}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                    className="h-9"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={price[1] || ""}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Area (sq ft)</h4>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={area[0] || ""}
                    onChange={(e) => handleAreaChange(0, e.target.value)}
                    className="h-9"
                  />
                  <span>-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={area[1] || ""}
                    onChange={(e) => handleAreaChange(1, e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Rooms</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5].map((room) => (
                    <div key={room} className="flex items-center space-x-2">
                      <Checkbox
                        id={`room-${room}-mobile`}
                        checked={rooms.includes(room)}
                        onCheckedChange={() => toggleRoom(room)}
                      />
                      <label
                        htmlFor={`room-${room}-mobile`}
                        className="text-sm"
                      >
                        {room} {room === 1 ? "Room" : "Rooms"}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Transaction Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  {transactionTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}-mobile`}
                        checked={types.includes(type)}
                        onCheckedChange={() => toggleType(type)}
                      />
                      <label
                        htmlFor={`type-${type}-mobile`}
                        className="text-sm capitalize"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Property Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  {propertyTypeOptions.map((propertyType) => (
                    <div
                      key={propertyType}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`property-${propertyType}-mobile`}
                        checked={propertyTypes.includes(propertyType)}
                        onCheckedChange={() => togglePropertyType(propertyType)}
                      />
                      <label
                        htmlFor={`property-${propertyType}-mobile`}
                        className="text-sm capitalize"
                      >
                        {propertyType}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={() => setIsOpen(false)}>
              Apply Filters
            </Button>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
