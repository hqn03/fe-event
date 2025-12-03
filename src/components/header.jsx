import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";

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
import React from "react";
import { useAuth } from "@/auth";
import { NavUser } from "./nav-user";
import { Link } from "@tanstack/react-router";

function Header({ navigationData = [], className }) {
  const { user, logout } = useAuth();

  return (
    <header
      className={cn("bg-background sticky top-0 z-50 h-16 border-b", className)}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="font-bold text-2xl">
          NHATEVENT{/* <Logo className="gap-3" /> */}
        </a>

        {/* Navigation */}
        <NavigationMenu className="max-md:hidden">
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
        </NavigationMenu>

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
        <div className="flex gap-4 md:hidden">
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
        </div>
      </div>
    </header>
  );
}

export default Header;
