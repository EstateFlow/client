import { useEffect, useState } from "react";
import { fetchUserById } from "@/api/BaseUrl";
import type { UserInfo } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { toast } from "sonner";

export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserById(userId)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error during user loading...", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleCopyEmail = async () => {
    if (!user) return;
    try {
      await navigator.clipboard.writeText(user.email);
      toast("Copied!", { description: "Email copied to clipboard." });
    } catch {
      toast("Error", { description: "Failed to copy email." });
    }
  };

  if (loading) {
    return (
      <Card className="rounded-xl overflow-hidden shadow-md">
        <CardContent className="flex flex-col sm:flex-row gap-6 p-6 animate-pulse">
          <div className="flex flex-col items-center sm:items-start gap-4">
            <div className="rounded-full bg-muted w-24 h-24"></div>
            <div className="text-center sm:text-left w-full">
              <div className="h-4 bg-muted rounded w-20 mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <div className="h-4 bg-muted rounded w-16 mb-2"></div>
                <div className="h-4 bg-muted rounded w-24"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  if (!user) return <div>User not found</div>;

  return (
    <Card className="rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
      <CardContent className="relative flex flex-col sm:flex-row gap-8 p-8">
        <div className="flex flex-col items-center sm:items-start gap-6 min-w-[180px]">
          <div className="rounded-full w-28 h-28 overflow-hidden shadow-lg border-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-5xl text-gray-600 dark:text-gray-400 transition-all duration-300">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="User avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              "👤"
            )}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <p className="font-semibold text-lg">About me:</p>
            <p className="text-gray-700 dark:text-gray-300 min-h-[3rem] whitespace-pre-wrap">
              {user.bio || "No bio provided."}
            </p>
            <p
              className="text-sm mt-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-3 py-1 select-all cursor-pointer transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              onClick={handleCopyEmail}
              title="Click to copy email"
            >
              {user.email}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 flex-1 text-sm text-gray-700 dark:text-gray-300">
          {[
            { label: "Username", value: user.username },
            { label: "Status", value: user.role },
            { 
              label: "Paypal", 
              value: user.paypalCredentials && (user.role === "private_seller" || user.role === "agency")
                ? user.paypalCredentials
                : "N/A"
            },
            { label: "Offer limit", value: user.listingLimit ?? "N/A" },
            {
              label: "Date of registration",
              value: user.createdAt
                ? format(new Date(user.createdAt), "dd MMM yyyy, HH:mm")
                : "N/A",
            },
            {
              label: "Last profile update",
              value: user.updatedAt
                ? format(new Date(user.updatedAt), "dd MMM yyyy, HH:mm")
                : "N/A",
            },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1">
              <p className="text-muted-foreground font-medium">{label}</p>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}