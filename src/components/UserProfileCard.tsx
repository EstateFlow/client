// components/UserProfileCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type UserInfo = {
  name: string;
  status: string;
  email: string;
  paypal: string;
  offerLimit: string;
  registrationDate: string;
  lastUpdate: string;
  about: string;
};

export default function UserProfileCard({ user }: { user: UserInfo }) {
  return (
    <Card className="rounded-xl overflow-hidden shadow-md">
      <CardContent className="flex flex-col sm:flex-row gap-6 p-6">
        <div className="flex flex-col items-center sm:items-start gap-4">
          <div className="rounded-full bg-black w-24 h-24 flex items-center justify-center text-white text-4xl">
            👤
          </div>
          <div className="text-center sm:text-left">
            <p className="font-semibold">About me:</p>
            <p>{user.about}</p>
            <p className="text-sm mt-2 bg-gray-200 rounded p-1">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1 text-sm">
          <div><p className="text-muted-foreground">Name</p><p>{user.name}</p></div>
          <div><p className="text-muted-foreground">Status</p><p>{user.status}</p></div>
          <div><p className="text-muted-foreground">Paypal</p><p>{user.paypal}</p></div>
          <div><p className="text-muted-foreground">Offer limit</p><p>{user.offerLimit}</p></div>
          <div><p className="text-muted-foreground">Date of registration</p><p>{user.registrationDate}</p></div>
          <div><p className="text-muted-foreground">Last profile update</p><p>{user.lastUpdate}</p></div>
        </div>

        <div className="flex items-start">
          <Button variant="secondary">Edit profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}
