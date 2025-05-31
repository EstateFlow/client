// components/UserProfileCard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { UserInfo } from "@/lib/types";
import { format } from "date-fns";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";

export default function UserProfileCard({ user }: { user: UserInfo }) {
  const {
    updateProfile,
    isLoading,
    requestEmailChange,
    requestPasswordChange,
  } = useUserStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: user.username,
    avatarUrl: user.avatarUrl || "",
    bio: user.bio || "",
    email: user.email,
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (formData.avatarUrl && !/^https?:\/\/.*/i.test(formData.avatarUrl)) {
      newErrors.avatarUrl = "Invalid URL format";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await updateProfile({
        username: formData.username,
        avatarUrl: formData.avatarUrl || undefined,
        bio: formData.bio || undefined,
      });

      if (formData.email !== user.email) {
        await requestEmailChange(formData.email);
      }

      if (formData.password) {
        await requestPasswordChange(formData.password);
      }

      toast("Success", {
        description:
          "Profile updated! Check your email for confirmation links if you changed email or password.",
      });
      setIsEditing(false);
    } catch (error) {
      toast("Error", {
        description: "Failed to update profile. Please try again.",
      });
      console.error("Profile update error:", error);
    }
  };
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(user.email);
      toast("Copied!", { description: "Email copied to clipboard." });
    } catch {
      toast("Error", { description: "Failed to copy email." });
    }
  };
  const handleCancel = () => {
    setFormData({
      username: user.username,
      avatarUrl: user.avatarUrl || "",
      bio: user.bio || "",
      email: user.email,
      password: "",
    });
    setErrors({});
    setIsEditing(false);
  };
  switch (user.role) {
    case "admin":
    case "private_seller":
    case "renter_buyer":
    case "moderator":
    default:
return (
    <>
      <Card className="rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
        <CardContent className="relative flex flex-col sm:flex-row gap-8 p-8">
          {/* Кнопка редактирования в верхнем правом углу */}
          <div className="absolute top-4 right-4">
            <Button
              variant="secondary"
              className="hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={handleEditClick}
            >
              Edit profile
            </Button>
          </div>

          {/* Левая часть с аватаром и базовой информацией */}
          <div className="flex flex-col items-center sm:items-start gap-6 min-w-[180px]">
            <div className="rounded-full w-28 h-28 overflow-hidden shadow-lg border-4 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-5xl text-gray-600 dark:text-gray-400 transition-all duration-300">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  loading="lazy"
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
                className="text-sm mt-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded px-3 py-1 select-all cursor-pointer transition-colors duration-300"
                onClick={handleCopyEmail}
                title="Click to copy email"
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* Правая часть с деталями профиля */}
          <div className="grid grid-cols-2 gap-6 flex-1 text-sm text-gray-700 dark:text-gray-300">
            {[
              { label: "Username", value: user.username },
              { label: "Status", value: user.role },
              { label: "Paypal", value: "ПЕЙПАЛ ПОКА НЕМА" },
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

      {/* Диалог редактирования */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form
            className="grid gap-5 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            noValidate
          >
            <div className="grid gap-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Your username"
                className={errors.username ? "border-red-500" : ""}
                autoFocus
                required
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={errors.email ? "border-red-500" : ""}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 6 characters"
                className={errors.password ? "border-red-500" : ""}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                value={formData.avatarUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
                className={errors.avatarUrl ? "border-red-500" : ""}
              />
              {errors.avatarUrl && (
                <p className="text-red-500 text-xs mt-1">{errors.avatarUrl}</p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
}