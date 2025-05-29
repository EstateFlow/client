// src/pages/ListingPage.tsx
import ListingFormToAdd from "@/components/ListingFormToAdd";

export default function ListingFormToAddPage({userId }: {userId: string }) {
  return (
    <div className="flex gap-8 p-8 justify-center items-start">
      <ListingFormToAdd ownerId ={userId} />
    </div>
  );
}
