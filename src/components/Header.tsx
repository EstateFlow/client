import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { User, LogOut } from "lucide-react"; // іконка профілю
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

function Header() {
  const [search, setSearch] = useState("");
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-100 via-white to-slate-100 shadow-sm border-b">
        {/* Левый блок */}
        <div className="flex items-center gap-6">
          {/* Логотип */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v18m9-9H3"
                />
              </svg>
            </div>
            <h1 className="font-bold text-2xl tracking-tight text-gray-800 select-none">EstateFlow</h1>
          </div>

          <nav className="flex gap-6 text-sm font-medium text-gray-600 select-none">
            <Link to="/" className="[&.active]:underline hover:text-black transition-colors">Home</Link>
            <Link to="/listings" className="[&.active]:underline hover:text-black transition-colors">Listings</Link>
          </nav>
        </div>

        {/* Правый блок */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 pl-3 py-2 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              size={16}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            className="min-w-[40px] px-2 rounded-md"
          >
            ENG
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="min-w-[40px] px-2 rounded-md"
          >
            🌞
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
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
            </div>
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
      </header>
    </>
  );
}

export default Header;
