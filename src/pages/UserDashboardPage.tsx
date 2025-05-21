import UserProfileCard from "@/components/UserProfileCard";
import OffersTabs from "@/components/OffersTabs";
import OfferGrid from "@/components/OfferGrid";
import type { UserInfo, Offer } from "@/lib/types"; // предполагаем, что типы вынесены отдельно
 // предполагаем, что типы вынесены отдельно

export default function UserDashboard({ user, offers }: { user: UserInfo; offers: Offer[]}) {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <UserProfileCard user={user} />
      <OffersTabs />
      <OfferGrid offers={offers}  role = {user.status}/>
    </div>
  );
}
