import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";

export function RestorePasswordStep2() {
  return (
    <form className="bg-muted p-6 rounded-xl space-y-4 w-full max-w-sm">
      <div className="text-center text-2xl">🔑</div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" type="password" placeholder="Enter new password" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="repeat-password">Repeat password</Label>
        <Input id="repeat-password" type="password" placeholder="Repeat new password" />
      </div>

        <Button className="w-full">Continue</Button>
        <Link to="/restore-password-step1" className="[&.active]:underline">
        <Button variant="ghost" className="w-full">← Back</Button>
        </Link>
      <div className="text-sm text-center underline">
        I remembered my password
      </div>
    </form>
  );
}
