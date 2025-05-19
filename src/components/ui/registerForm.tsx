import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export function RegisterForm() {
  return (
    <form className="bg-muted p-6 rounded-xl space-y-4 w-full max-w-sm">
      <div className="flex flex-col gap-2">
        <Label htmlFor="login">Login</Label>
        <Input id="login" placeholder="Choose login" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Create password" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="repeat-password">Repeat password</Label>
        <Input id="repeat-password" type="password" placeholder="Repeat password" />
      </div>

      <Button className="w-full">Continue</Button>

      <div className="flex items-center gap-4">
        <div className="flex-grow h-px bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="flex-grow h-px bg-border" />
      </div>

      <Button variant="outline" className="w-full flex items-center gap-2">
        <FcGoogle className="w-5 h-5" />
        Continue with Google
      </Button>

      <Button className="w-full flex items-center gap-2 bg-[#1877F2] text-white hover:bg-[#166fe0]">
        <FaFacebook className="w-5 h-5" />
        Continue with Facebook
      </Button>

      <div className="text-sm text-center underline">
        I already have an account
      </div>
    </form>
  );
}
