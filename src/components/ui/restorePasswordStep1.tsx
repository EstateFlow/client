import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";

export function RestorePasswordStep1() {
  return (
    <form className="bg-muted p-6 rounded-xl space-y-4 w-full max-w-sm">
      <div className="text-center text-2xl">🔒</div>
      <div className="text-center text-sm">
        Please enter your email and wait for a notice to arrive
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter email" />
      </div>
        <Link to="/restore-password-step2" className="[&.active]:underline">
            <Button className="w-full">Continue</Button>
        </Link>
        <Link to="/loginForm" className="[&.active]:underline">
            <Button variant="ghost" className="w-full">← Back</Button>
        </Link>
      <div className="text-sm text-center underline">
        I remember my password
      </div>
    </form>
  );
}
