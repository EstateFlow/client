// components/UserProfileCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserInfo } from "@/lib/types";
import { format } from "date-fns";

export default function UserProfileCard({ user }: { user: UserInfo }) {
  switch (user.role) {
    case "admin":
    case "private_seller":
    case "renter_buyer":
    case "moderator":
    default:
      return (
        <Card className="rounded-xl overflow-hidden shadow-md">
          <CardContent className="flex flex-col sm:flex-row gap-6 p-6">
            <div className="flex flex-col items-center sm:items-start gap-4">
              <div className="rounded-full bg-black w-24 h-24 flex items-center justify-center text-white text-4xl">
                👤
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold">About me:</p>
                <p> {user.bio} </p>
                <p className="text-sm mt-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded p-1 transition-colors duration-300">
                  {user.email}
                </p>
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

            <div className="flex items-start">
              <Button variant="secondary">Edit profile</Button>
            </div>
          </CardContent>
        </Card>
      );
  }
}
