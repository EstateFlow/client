import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { GoogleLogin } from "./GoogleLogin";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { register, isLoading, error, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      toast("Success", {
        description: "Registration successful. Please verify your email.",
      });
    }
  }, [user, navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
      role: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = "Please select a role";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!validateForm()) return;

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      setFormData({
        username: "",
        email: "",
        password: "",
        repeatPassword: "",
        role: "",
      });
    } catch (error: any) {
      toast("Error", {
        description: error.message || "Registration failed",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });

    if (formSubmitted) {
      setErrors({ ...errors, [e.target.id]: "" });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, role: value });
    if (formSubmitted) {
      setErrors({ ...errors, role: "" });
    }
  };

  const shouldShowErrors = formSubmitted && !isLoading;

  return (
    <form
      className="bg-background border border-border p-6 rounded-xl space-y-4 w-full max-w-sm relative shadow-sm"
      onSubmit={handleSubmit}
    >
      <Link
        to="/"
        className="absolute top-2 right-2 p-1 hover:bg-muted rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
      </Link>

      <div className="flex flex-col gap-2">
        <Label htmlFor="username">Login</Label>
        <Input
          id="username"
          placeholder="Choose login"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
        />
        {shouldShowErrors && errors.username && (
          <p className="text-red-500 text-sm">{errors.username}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
        {shouldShowErrors && errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
        {shouldShowErrors && errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="repeatPassword">Repeat password</Label>
        <Input
          id="repeatPassword"
          type="password"
          placeholder="Repeat password"
          value={formData.repeatPassword}
          onChange={handleChange}
          disabled={isLoading}
        />
        {shouldShowErrors && errors.repeatPassword && (
          <p className="text-red-500 text-sm">{errors.repeatPassword}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Select onValueChange={handleSelectChange} disabled={isLoading}>
          <SelectTrigger className="w-full border-input focus:border-ring focus:ring-ring">
            <SelectValue placeholder="Choose your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="renter_buyer">Renter/Buyer</SelectItem>
            <SelectItem value="private_seller">Private Seller</SelectItem>
          </SelectContent>
        </Select>
        {shouldShowErrors && errors.role && (
          <p className="text-red-500 text-sm">{errors.role}</p>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center bg-red-100 p-2 rounded">
          {error}
        </p>
      )}

      <Button className="w-full cursor-pointer" disabled={isLoading}>
        {isLoading ? "Registering..." : "Continue"}
      </Button>

      <div className="flex items-center gap-4">
        <div className="flex-grow h-px bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="flex-grow h-px bg-border" />
      </div>

      <GoogleLogin />

      <Button
        className="w-full flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground cursor-pointer"
        disabled={isLoading}
      >
        <FaFacebook className="w-5 h-5" />
        Continue with Facebook
      </Button>

      <Link to="/login-form" className="[&.active]:underline">
        <div className="text-sm text-center underline">
          I already have an account
        </div>
      </Link>
    </form>
  );
}
