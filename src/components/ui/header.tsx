import type { ReactNode} from "react";
import {  useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type HeaderProps = {
  children?: ReactNode;
};

function Header({ children }: HeaderProps) {
  const [search, setSearch] = useState("");
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-gray-100">
        {/* Левый блок */}
        <div className="flex items-center gap-4">
          {/* Логотип */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-md flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="white"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
              </svg>
            </div>
            <h1 className="font-bold text-xl select-none">EstateFlow</h1>
          </div>

          {/* Навигация */}
          <nav className="flex gap-6 text-sm font-medium select-none">
            <Link to="/" className="[&.active]:underline text-gray-700">
              Home
            </Link>
            <Link to="/listings" className="[&.active]:underline text-gray-700">
              Listings
            </Link>

            <Link to="/user-dashboard" className="[&.active]:underline text-gray-700">
              Profile(Now only buyer)
            </Link>
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
              className="pr-10 rounded-md bg-gray-200"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
          </div>

          <Button variant="outline" size="sm" className="min-w-[40px] px-2 rounded-md">
            ENG
          </Button>
          <Button variant="outline" size="sm" className="min-w-[40px] px-2 rounded-md">
            🌞
          </Button>

          <Link to="/loginForm" className="[&.active]:underline text-gray-700">
            <Button variant="default" size="sm" className="min-w-[70px] rounded-md">
            Log In          
            </Button>
          </Link>

          <Button variant="outline" size="sm" className="min-w-[70px] rounded-md">
            Sign Up
          </Button>
        </div>
      </header>

      <main className="p-4">
        {children}
      </main>
    </>
  );
}

export default Header;