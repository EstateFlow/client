import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Edit,
  User,
  Calendar,
  Plus,
  Shield,
  Building,
  Users,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUsersStore } from "@/store/usersStore";
import { useTranslation } from "react-i18next";

interface User {
  id: string;
  username: string;
  email: string;
  role: "renter_buyer" | "private_seller" | "agency" | "moderator" | "admin";
  isEmailVerified: boolean;
  paypalCredentials?: string;
  listingLimit?: number;
  avatarUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

interface ActionLoading {
  [key: string]: boolean;
}

const UserManagementPage = () => {
  const { t } = useTranslation();
  const {
    users,
    isLoading,
    error,
    fetchAllUsers,
    deleteUser,
    addUser,
    updateUser,
  } = useUsersStore();
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState<ActionLoading>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "moderator" as User["role"],
    listingLimit: -1,
    bio: "This section is yet empty.",
  });

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  useEffect(() => {
    if (error) {
      toast(t("error"), {
        description: t(error) || error || t("genericError"),
      });
    }
  }, [error]);

  const handleDeleteUser = async (userId: string) => {
    setActionLoading((prev) => ({ ...prev, [`delete-${userId}`]: true }));
    try {
      await deleteUser(userId);
      toast(t("success"), {
        description: t("userDeletedSuccess"),
      });
    } catch (error) {
      toast(t("error"), {
        description: t("userDeleteFailed"),
      });
      console.error("Error deleting user:", error);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`delete-${userId}`]: false,
      }));
    }
  };

  const handleAddUser = async () => {
    setActionLoading((prev) => ({ ...prev, "add-user": true }));
    try {
      await addUser(newUser);
      setNewUser({
        username: "",
        email: "",
        password: "",
        role: "moderator",
        listingLimit: -1,
        bio: "This section is yet empty.",
      });
      setIsAddDialogOpen(false);
      toast(t("success"), {
        description: t("userAddedSuccess"),
      });
    } catch (error) {
      toast(t("error"), {
        description: t("userAddFailed"),
      });
      console.error("Error adding user:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, "add-user": false }));
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;
    setActionLoading((prev) => ({ ...prev, [`edit-${editingUser.id}`]: true }));
    try {
      await updateUser(editingUser);
      setEditingUser(null);
      setIsEditDialogOpen(false);
      toast(t("success"), {
        description: t("userUpdatedSuccess"),
      });
    } catch (error) {
      toast(t("error"), {
        description: t("userUpdateFailed"),
      });
      console.error("Error updating user:", error);
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [`edit-${editingUser.id}`]: false,
      }));
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "moderator") return user.role === "moderator";
    if (filter === "admin") return user.role === "admin";
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck size={14} />;
      case "moderator":
        return <Shield size={14} />;
      case "agency":
        return <Building size={14} />;
      default:
        return <User size={14} />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "moderator":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "agency":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "private_seller":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-yellow-100 text-gray-800 dark:bg-yellow-900 dark:text-gray-300";
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg border p-4 space-y-4"
                >
                  <div className="h-20 bg-muted rounded-full w-20"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("userManagementTitle")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("userManagementDescription")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 cursor-pointer">
                  <Plus size={16} />
                  {t("addUser")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t("addNewUser")}</DialogTitle>
                  <DialogDescription>
                    {t("addNewUserDescription")}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="block text-sm font-medium"
                    >
                      {t("username")}
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      placeholder="Enter username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      {t("email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="block text-sm font-medium"
                    >
                      {t("password")}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        placeholder="Enter password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="block text-sm font-medium">
                      {t("role")}
                    </Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value) =>
                        setNewUser((prev) => ({
                          ...prev,
                          role: value as User["role"],
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t("roles")}</SelectLabel>
                          <SelectItem value="moderator">
                            {t("moderator")}
                          </SelectItem>
                          <SelectItem value="admin">{t("admin")}</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="block text-sm font-medium">
                      {t("bio")}
                    </Label>
                    <Textarea
                      id="bio"
                      value={newUser.bio}
                      onChange={(e) =>
                        setNewUser((prev) => ({ ...prev, bio: e.target.value }))
                      }
                      placeholder="Enter bio"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddUser}
                    disabled={
                      actionLoading["add-user"] ||
                      !newUser.username ||
                      !newUser.email ||
                      !newUser.password
                    }
                    className="gap-2 cursor-pointer"
                  >
                    {actionLoading["add-user"] ? "Adding..." : "Add User"}
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer">
                      {t("cancel")}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("all")}
                className="rounded-md cursor-pointer"
              >
                {t("all")} ({users.length})
              </Button>
              <Button
                variant={filter === "moderator" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("moderator")}
                className="rounded-md cursor-pointer"
              >
                <Shield size={14} className="mr-1" />
                {t("moderators")} (
                {users.filter((user) => user.role === "moderator").length})
              </Button>
              <Button
                variant={filter === "admin" ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter("admin")}
                className="rounded-md cursor-pointer"
              >
                <ShieldCheck size={14} className="mr-1" />
                {t("admins")} (
                {users.filter((user) => user.role === "admin").length})
              </Button>
            </div>
          </div>
        </div>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">{t("noUsersFound")}</h3>
            <p className="text-muted-foreground">
              {filter === "all"
                ? t("noUsersAvailable")
                : `No ${filter} users found.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-card rounded-lg border hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">
                          {user.username}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.isEmailVerified
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {user.isEmailVerified ? "Verified" : "Pending"}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full capitalize flex items-center gap-1 ${getRoleBadgeColor(
                          user.role,
                        )}`}
                      >
                        {getRoleIcon(user.role)}
                        {user.role.replace("_", " ")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t("listingsUserMagementPage")}{" "}
                        {user.role === "agency"
                          ? "∞"
                          : user.role === "private_seller"
                            ? user.listingLimit
                            : "N/A"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {user.bio}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>
                        {t("joined")} {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    {["admin", "moderator"].includes(user.role) ? (
                      <>
                        <Dialog
                          open={isEditDialogOpen && editingUser?.id === user.id}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (!open) setEditingUser(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 cursor-pointer"
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit size={14} />
                              {t("edit")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>{t("editUser")}</DialogTitle>
                              <DialogDescription>
                                {t("userUpdate")}
                              </DialogDescription>
                            </DialogHeader>
                            {editingUser && (
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="edit-username"
                                    className="block text-sm font-medium"
                                  >
                                    {t("username")}
                                  </Label>
                                  <Input
                                    id="edit-username"
                                    type="text"
                                    value={editingUser.username}
                                    onChange={(e) =>
                                      setEditingUser((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              username: e.target.value,
                                            }
                                          : null,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="edit-email"
                                    className="block text-sm font-medium"
                                  >
                                    {t("email")}
                                  </Label>
                                  <Input
                                    id="edit-email"
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) =>
                                      setEditingUser((prev) =>
                                        prev
                                          ? { ...prev, email: e.target.value }
                                          : null,
                                      )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="edit-role"
                                    className="block text-sm font-medium"
                                  >
                                    {t("role")}
                                  </Label>
                                  <Select
                                    value={editingUser.role}
                                    onValueChange={(value) =>
                                      setEditingUser((prev) =>
                                        prev
                                          ? {
                                              ...prev,
                                              role: value as User["role"],
                                              listingLimit:
                                                value === "agency"
                                                  ? undefined
                                                  : value === "private_seller"
                                                    ? prev.listingLimit || 5
                                                    : -1,
                                            }
                                          : null,
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectLabel>Roles</SelectLabel>
                                        <SelectItem value="moderator">
                                          {t("moderator")}
                                        </SelectItem>
                                        <SelectItem value="admin">
                                          {t("admin")}
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="edit-bio"
                                    className="block text-sm font-medium"
                                  >
                                    {t("bio")}
                                  </Label>
                                  <Textarea
                                    id="edit-bio"
                                    value={editingUser.bio}
                                    onChange={(e) =>
                                      setEditingUser((prev) =>
                                        prev
                                          ? { ...prev, bio: e.target.value }
                                          : null,
                                      )
                                    }
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                onClick={handleEditUser}
                                disabled={
                                  actionLoading[`edit-${editingUser?.id}`] ||
                                  !editingUser?.username ||
                                  !editingUser?.email
                                }
                                className="gap-2 cursor-pointer"
                              >
                                {actionLoading[`edit-${editingUser?.id}`]
                                  ? t("updating")
                                  : t("updateUser")}
                              </Button>
                              <DialogClose asChild>
                                <Button variant="outline">{t("cancel")}</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-2 cursor-pointer"
                            >
                              <Trash2 size={14} />
                              {actionLoading[`delete-${user.id}`]
                                ? "..."
                                : t("deleteUser")}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t("Delete User Account")}</DialogTitle>
                              <DialogDescription>
                                {t("deleteUserDescriptionPart1")} "
                                {user.username}"?{" "}
                                {t("deleteUserDescriptionPart2")}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={actionLoading[`delete-${user.id}`]}
                                className="gap-2 cursor-pointer"
                              >
                                {actionLoading[`delete-${user.id}`]
                                  ? t("deleting")
                                  : t("deleteUser")}
                              </Button>
                              <DialogClose asChild>
                                <Button
                                  variant="outline"
                                  className="cursor-pointer"
                                >
                                  {t("cancel")}
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground w-full text-center">
                        {t("userManagementRestricted")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
