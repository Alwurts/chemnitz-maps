import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import { useAuth } from "@/components/AuthProvider";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

import { BookUser, LogOut, User } from "lucide-react";

import { Badge } from "./ui/badge";

interface UserAvatarInterface {
  className?: string;
}

export function UserAvatar({ className }: UserAvatarInterface) {
  const { logout, authTokens } = useAuth();
  const { toast } = useToast();

  if (!authTokens) {
    return (
      <Link
        className={buttonVariants({
          variant: "outline",
          className: cn("h-10 rounded-2xl lg:hidden", className),
        })}
        to="/login"
      >
        Login
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn("relative h-11 w-11 rounded-full shadow-xl", className)}
      >
        <Avatar className="h-full w-11 border-2 border-stone-600 bg-white">
          <AvatarImage
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJibGFjayIgZD0iTTEyIDRhNCA0IDAgMCAxIDQgNGE0IDQgMCAwIDEtNCA0YTQgNCAwIDAgMS00LTRhNCA0IDAgMCAxIDQtNG0wIDEwYzQuNDIgMCA4IDEuNzkgOCA0djJINHYtMmMwLTIuMjEgMy41OC00IDgtNCIvPjwvc3ZnPg=="
            alt="user"
          />
        </Avatar>
        {authTokens.userType === "premium" && (
          <Badge className="absolute -left-6 -top-4 z-20 bg-sky-600 px-1.5">
            Premium
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            search={(prev) => ({
              ...prev,
              profilePanel: {
                mode: "EDIT",
              },
            })}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            search={(prev) => ({
              ...prev,
              addressPanel: { type: "LIST" },
            })}
          >
            <BookUser className="mr-2 h-4 w-4" />
            Addresses
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout();
            toast({
              title: "Logged out!",
            });
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
