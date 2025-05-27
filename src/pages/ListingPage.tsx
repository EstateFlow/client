// src/pages/ListingPage.tsx
import ListingForm from "@/components/ListingForm";

export default function ListingPage({ role, propertyId }: { role: string; propertyId: string }) {
  return (
    <div className="flex gap-8 p-8 justify-center items-start">
      <ListingForm role={role} propertyId = {propertyId} />
    </div>
  );
}
