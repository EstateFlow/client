import { useEffect, useState } from "react";
import { fetchUserById } from "@/api/BaseUrl";
import type { UserInfo } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export default function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserById(userId)
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error during user loading...", err))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <Card className="rounded-xl overflow-hidden shadow-md">
      <CardContent className="flex flex-col sm:flex-row gap-6 p-6">
        <div className="flex flex-col items-center sm:items-start gap-4">
          <div className="rounded-full bg-black w-24 h-24 flex items-center justify-center text-white text-4xl">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <>👤</>
            )}
          </div>
          <div className="text-center sm:text-left">
            <p className="font-semibold">About me:</p>
            <p> {user.bio} </p>
            <p className="text-sm mt-2 bg-gray-200 rounded p-1">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1 text-sm">
          <div>
            <p className="text-muted-foreground">Username</p>
            <p>{user.username}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <p>{user.role}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Paypal</p>
            <p>ПЕЙПАЛ ПОКА НЕМА</p>
          </div>
          <div>
            <p className="text-muted-foreground">Offer limit</p>
            <p>{user.listingLimit ? user.listingLimit : "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date of registration</p>
            <p>
              {user.createdAt
                ? format(new Date(user.createdAt), "dd MMM yyyy, HH:mm")
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Last profile update</p>
            <p>
              {user.updatedAt
                ? format(new Date(user.updatedAt), "dd MMM yyyy, HH:mm")
                : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
