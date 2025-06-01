import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OffersTabs() {
  return (
    <div className="border-t p-4 flex gap-4">
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Offers</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Offers</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
