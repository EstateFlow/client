import UserProfile from "@/components/UserProfileCardFromProperty";

export default function UserProfilePage({ userId}: { userId: string}) {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <UserProfile userId={userId} />
    </div>
  );
}