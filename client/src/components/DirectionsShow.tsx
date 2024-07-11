import { Link, getRouteApi } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import { MapPin } from "lucide-react";

import { buttonVariants } from "./ui/button";

const indexRoute = getRouteApi("/");

export function DirectionsShow() {
  const { directions } = indexRoute.useSearch();

  return (
    <div className="grid w-full grid-cols-4 items-center gap-2 lg:mr-4 lg:max-w-4xl">
      <Link
        title="From location"
        search={(prev) => ({
          ...prev,
          directionsPanel: { mode: "EDIT" },
        })}
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          "col-span-2 flex space-x-2 rounded-full shadow-xl hover:shadow-2xl"
        )}
      >
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="truncate">{`From: ${directions?.fromLocation.label}`}</span>
      </Link>
      <Link
        title="From location"
        search={(prev) => ({
          ...prev,
          directionsPanel: { mode: "EDIT" },
        })}
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          "col-span-2 flex space-x-2 rounded-full shadow-xl hover:shadow-2xl"
        )}
      >
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="truncate">{`To: ${directions?.toLocation.label}`}</span>
      </Link>
    </div>
  );
}
