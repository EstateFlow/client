import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link } from "@tanstack/react-router";

export function LoginForm() {
  return (
    <form className="bg-muted p-6 rounded-xl space-y-4 w-full max-w-sm">
      <div className="flex flex-col gap-2">
        <Label htmlFor="login">Login</Label>
        <Input id="login" placeholder="Enter login" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>
      <Link to="/restore-password-step1" className="[&.active]:underline">
        <div className="text-right text-sm text-blue-500 cursor-pointer underline">
          Forgot password?
        </div>
      </Link>


      <Button className="w-full mt-2">Continue</Button>

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
      <Link to="/register-form" className="[&.active]:underline">
        <div className="text-sm text-center underline">
          I don’t have an account
        </div>
      </Link>
    </form>
  );
}
