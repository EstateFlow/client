import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import ThemeSwitcher from "./ThemeSwitcher";
import logo from "@/assets/images/estateflow_logo.jpg";
import { Skeleton } from "./ui/skeleton";
import { useUserStore } from "@/store/userStore";
import "../i18n";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, isInitialized, isLoading } = useAuthStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    toast.success(t("success"), { description: t("loggedOutSuccessfully") });
    navigate({ to: "/" });
  };

  const isActiveLink = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md">
                    <img
                      src={logo}
                      alt="estateflow_logo"
                      className="rounded-md"
                    />
                  </div>
                  <h1 className="font-bold text-xl lg:text-2xl tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent select-none">
                    EstateFlow
                  </h1>
                </div>
              </Link>

              <nav className="hidden md:flex gap-1 text-sm font-medium select-none">
                {user && user.role === "admin" ? (
                  <Link to="/">
                    <Button
                      variant="ghost"
                      className={`font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                        isActiveLink("/") ? "bg-accent/90" : ""
                      }`}
                    >
                      {t("promptEditing")}
                    </Button>
                  </Link>
                ) : user?.role === "moderator" ? (
                  <Link to="/">
                    <Button
                      variant="ghost"
                      className={`font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                        isActiveLink("/") ? "bg-accent/90" : ""
                      }`}
                    >
                      {t("statistics")}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/">
                    <Button
                      variant="ghost"
                      className={`font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                        isActiveLink("/") ? "bg-accent/90" : ""
                      }`}
                    >
                      {t("home")}
                    </Button>
                  </Link>
                )}
                {user && user.role === "moderator" ? (
                  <Link to="/property-management">
                    <Button
                      variant="ghost"
                      className={`font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                        isActiveLink("/property-management")
                          ? "bg-accent/90"
                          : ""
                      }`}
                    >
                      {t("propertyManagement")}
                    </Button>
                  </Link>
                ) : user?.role === "admin" ? (
                  <Link to="/user-management">
                    <Button
                      variant="ghost"
                      className={`font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                        isActiveLink("/user-management") ? "bg-accent/90" : ""
                      }`}
                    >
                      {t("userManagement")}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/listings">
                    <Button
                      variant="ghost"
                      className={`font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                        isActiveLink("/listings") ? "bg-accent/90" : ""
                      }`}
                    >
                      {t("listings")}
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeSwitcher />

              <div className="hidden md:flex items-center gap-2">
                {isLoading || !isInitialized ? (
                  <>
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </>
                ) : isAuthenticated ? (
                  <>
                    <Link to="/user-dashboard">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full cursor-pointer"
                      >
                        <User className="w-5 h-5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login-form"
                      className="[&.active]:underline text-gray-700"
                    >
                      <Button
                        variant="default"
                        size="sm"
                        className="min-w-[70px] rounded-md"
                      >
                        {t("logIn")}
                      </Button>
                    </Link>
                    <Link to="/register-form" className="[&.active]:underline">
                      <Button
                        variant="outline"
                        size="sm"
                        className="min-w-[70px] rounded-md"
                      >
                        {t("signUp")}
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden rounded-full p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden border-t backdrop-blur flex-row gap-2 p-2">
              <nav className="flex flex-col gap-1">
                {user && user.role === "moderator" ? (
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                        isActiveLink("/") ? "bg-accent/90" : ""
                      }`}
                    >
                      {t("statistics")}
                    </Button>
                  </Link>
                ) : user && user.role === "admin" ? (
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                        isActiveLink("/") ? "bg-accent/90" : ""
                      }`}
                    >
                      {t("promptEditing")}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                        isActiveLink("/") ? "bg-accent/90" : ""
                      }`}
                    >
                      {t("home")}
                    </Button>
                  </Link>
                )}
                {user && user.role === "moderator" ? (
                  <Link
                    to="/property-management"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                        isActiveLink("/property-management")
                          ? "bg-accent/90"
                          : ""
                      }`}
                    >
                      {t("propertyManagement")}
                    </Button>
                  </Link>
                ) : user?.role === "admin" ? (
                  <Link
                    to="/user-management"
                    className={`w-full font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                      isActiveLink("/user-management") ? "bg-accent/90" : ""
                    }`}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start cursor-pointer"
                    >
                      {t("userManagement")}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/listings" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                        isActiveLink("/listings") ? "bg-accent/90" : ""
                      }`}
                    >
                      {t("listings")}
                    </Button>
                  </Link>
                )}
              </nav>

              <div className="pt-3 border-t mt-2">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/user-dashboard"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                      >
                        <User size={16} />
                        {t("profileDashboard")}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 hover:bg-destructive/10 hover:text-destructive transition-colors"
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut size={16} />
                      {t("logout")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login-form" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        {t("logIn")}
                      </Button>
                    </Link>
                    <Link
                      to="/register-form"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full">{t("signUp")}</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
