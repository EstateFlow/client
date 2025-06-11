import { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";

export function FilterSidebar() {
  const { t } = useTranslation();
  const {
    price,
    setPrice,
    area,
    setArea,
    availableRooms,
    rooms,
    toggleRoom,
    availableTypes,
    types,
    toggleType,
    availablePropertyTypes,
    propertyTypes,
    togglePropertyType,
    fetchFilters,
    isLoading,
    error,
  } = useFilterStore();

  useEffect(() => {
    if (
      availableTypes.length === 0 ||
      availableRooms.length === 0 ||
      availablePropertyTypes.length === 0
    ) {
      fetchFilters();
    }
  }, [fetchFilters, availableTypes, availableRooms, availablePropertyTypes]);

  const [isOpen, setIsOpen] = useState(false);

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

  const handleApplyFilters = () => {
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="hidden md:block w-64 p-4 rounded-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-20 mb-4"></div>
          <div className="space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hidden md:block w-64 p-4 rounded-lg">
        <div className="text-red-500 text-sm">
          <p>Error loading filters: {error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFilters}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block w-64 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">{t("filters")}</h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-2">{t("priceRange")}</h4>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder={t("min")}
                value={price[0] || ""}
                onChange={(e) => handlePriceChange(0, e.target.value)}
                className="h-9"
              />
              <span>-</span>
              <Input
                type="number"
                placeholder={t("max")}
                value={price[1] || ""}
                onChange={(e) => handlePriceChange(1, e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">{t("area")} (sq ft)</h4>
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
            <h4 className="text-sm font-medium mb-2">{t("rooms")}</h4>
            <div className="grid grid-cols-2 gap-2">
              {availableRooms.map((room) => (
                <div key={room} className="flex items-center space-x-2">
                  <Checkbox
                    id={`room-${room}`}
                    checked={rooms.includes(room)}
                    onCheckedChange={() => toggleRoom(room)}
                  />
                  <label htmlFor={`room-${room}`} className="text-sm">
                    {room} {room === 1 ? t("room") : t("rooms")}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">{t("transactionType")}</h4>
            <div className="grid grid-cols-2 gap-2">
              {availableTypes.map((type) => (
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
            <h4 className="text-sm font-medium mb-2">{t("propertyType")}</h4>
            <div className="grid grid-cols-2 gap-2">
              {availablePropertyTypes.map((propertyType) => (
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
              <span>{t("filters")}</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <DrawerHeader>
              <DrawerTitle>{t("filters")}</DrawerTitle>
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
                  {availableRooms.map((room) => (
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
                  {availableTypes.map((type) => (
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
                  {availablePropertyTypes.map((propertyType) => (
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
            <Button className="mt-4 w-full" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}
