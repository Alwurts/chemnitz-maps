import { useLikeFacility } from "@/services/favorite";
import { Facility } from "@/types/models";
import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import { useAuth } from "@/components/AuthProvider";
import { ErrorMessage } from "@/components/ErrorMessage";
import { MdiHeart } from "@/components/icons/MdiHeart";
import { MdiHeartOutline } from "@/components/icons/MdiHeartOutline";
import { Button, buttonVariants } from "@/components/ui/button";

import { KeyRound } from "lucide-react";

import { UpgradeAccountButton } from "./UpgradeAccountButton";

interface LikeButtonProps {
  selectedFacility: Facility;
  className?: string;
}

export function LikeButton({ selectedFacility, className }: LikeButtonProps) {
  const { authTokens } = useAuth();

  const like = useLikeFacility();

  if (!authTokens) {
    return (
      <Link
        to="/login"
        className={buttonVariants({
          variant: "outline",
          className,
        })}
      >
        <KeyRound className={cn("mr-1.5 h-6 w-6 text-yellow-400")} />
        Login to save as favorite
      </Link>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        className={className}
        disabled={like.isPending}
        onClick={() => {
          like.mutate(selectedFacility);
        }}
      >
        {selectedFacility.is_favorite ? (
          <MdiHeart className={cn("h-7 w-7 text-pink-600")} />
        ) : (
          <MdiHeartOutline className={cn("h-7 w-7 text-pink-600")} />
        )}
        <p className="mx-3">
          {selectedFacility.is_favorite
            ? "Selected as Favorite"
            : "Mark as favorite"}
        </p>
      </Button>
      <div className="space-y-2 px-4 pb-3">
        <ErrorMessage className="text-black" error={like.error} />
        {authTokens.userType === "basic" &&
          // @ts-expect-error - TODO: Fix this type
          like.error?.response.status === 403 && <UpgradeAccountButton />}
      </div>
    </>
  );
}
