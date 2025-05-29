import UserProfileCard from "@/components/UserProfileCard";
import OfferCardGridByOwner from "@/components/OfferCardGridByOwner";
import type { UserInfo } from "@/lib/types";

export default function UserDashboard({ user }: { user: UserInfo }) {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <UserProfileCard user={user} />
      <OfferCardGridByOwner user={user} />
    </div>
  );
}
