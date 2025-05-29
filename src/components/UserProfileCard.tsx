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
          <Card className="rounded-xl overflow-hidden shadow-md">
            <CardContent className="flex flex-col sm:flex-row gap-6 p-6">
              <div className="flex flex-col items-center sm:items-start gap-4">
                <div className="rounded-full bg-black w-24 h-24 flex items-center justify-center text-white text-4xl">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    "👤"
                  )}
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
                <Button variant="secondary" onClick={handleEditClick}>
                  Edit profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={errors.username ? "border-red-500" : ""}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
                <div className="grid gap-2">
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
                    <p className="text-red-500 text-sm">{errors.avatarUrl}</p>
                  )}
                </div>
                <div className="grid gap-2">
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
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
  }
}
