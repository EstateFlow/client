import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { User, LogOut, Globe, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import ThemeSwitcher from "./ThemeSwitcher";
import logo from "@/assets/images/estateflow_logo.jpg";
import { Skeleton } from "./ui/skeleton";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, isInitialized, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
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
            {/* Левый блок */}
            <div className="flex items-center gap-6">
              {/* Логотип */}
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
                <Link to="/">
                  <Button
                    variant="ghost"
                    className={`font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                      isActiveLink("/") ? "bg-accent/90" : ""
                    }`}
                  >
                    Home
                  </Button>
                </Link>
                <Link to="/listings">
                  <Button
                    variant="ghost"
                    className={`font-medium hover:bg-accent/90 ease-in-out duration-300 transition-colors cursor-pointer ${
                      isActiveLink("/listings") ? "bg-accent/90" : ""
                    }`}
                  >
                    Listings
                  </Button>
                </Link>
              </nav>
            </div>

            {/* Правый блок */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 rounded-full px-3 hover:bg-accent/50 transition-colors"
              >
                <Globe size={14} />
                <span className="text-xs font-medium">EN</span>
              </Button>
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
                        Log In
                      </Button>
                    </Link>
                    <Link to="/register-form" className="[&.active]:underline">
                      <Button
                        variant="outline"
                        size="sm"
                        className="min-w-[70px] rounded-md"
                      >
                        Sign Up
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

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t backdrop-blur flex-row gap-2 p-2">
              <nav className="flex flex-col gap-1">
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer"
                  >
                    Home
                  </Button>
                </Link>
                <Link to="/listings" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start cursor-pointer"
                  >
                    Listings
                  </Button>
                </Link>
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
                        Profile Dashboard
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
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login-form" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link
                      to="/register-form"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full">Sign Up</Button>
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
