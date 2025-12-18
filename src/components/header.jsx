import { cn } from "@/lib/utils";
import { DeleteIcon, MenuIcon, SearchIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import React, { useState } from "react";
import { useAuth } from "@/auth";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Input } from "./ui/input";

function Header({ navigationData = [], className }) {
  const { user, logout } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate({});
  const { type } = useSearch({});

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    navigate({
      from: "",
      to: "search",
      search: {
        q: searchValue,
        type: type,
      },
    });

    // const test = api.get(`events/search?q=${searchValue}`)
  };

  return (
    <header
      className={cn("bg-background sticky top-0 z-50 h-16 border-b", className)}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-6">
        {/* Logo */}
        <Link to={"/"} className="font-bold text-2xl">
          NHATEVENT{/* <Logo className="gap-3" /> */}
        </Link>

        {/* Navigation */}
        {/* <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="flex-wrap justify-start gap-0">
            {navigationData.map((navItem) => (
              <NavigationMenuItem key={navItem.title}>
                <NavigationMenuLink
                  href={navItem.href}
                  className="text-muted-foreground hover:text-primary px-3 py-1.5 text-base! font-medium hover:bg-transparent"
                >
                  {navItem.title}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu> */}

        {/* SEARCH BAR */}
        <div className="flex items-center border px-2 rounded-lg max-md:hidden">
          <SearchIcon size={"16"} />
          <Input
            className={"border-none! ring-0! shadow-none w-2xl"}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            className={`${searchValue ? "visible" : "invisible"}`}
            size={"icon"}
            variant={"ghost"}
            onClick={() => {
              setSearchValue("");
            }}
          >
            <X />
          </Button>
        </div>

        {/* Login Button */}
        {user ? (
          <div className="flex items-center gap-8">
            <div>{user.fullname}</div>
            <Button className="rounded-lg max-md:hidden" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button className="rounded-lg max-md:hidden" asChild>
            <Link to={"/login"}>Login</Link>
          </Button>
        )}

        {/* Navigation for small screens */}
        {/* <div className="flex gap-4 md:hidden">
          <Button className="rounded-lg" asChild>
            <a href="#">Login</a>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              {navigationData.map((item, index) => (
                <DropdownMenuItem key={index}>
                  <a href={item.href}>{item.title}</a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
      </div>
    </header>
  );
}

export default Header;
