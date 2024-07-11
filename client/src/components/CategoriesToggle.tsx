import { cloneElement } from "react";

import { FacilityType } from "@/types/models";
import { Link, getRouteApi } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";

import {
  CircleDotDashed,
  GraduationCap,
  Heart,
  MapPin,
  School,
  University,
  User,
} from "lucide-react";

import { buttonVariants } from "./ui/button";

interface CategoriesToggleInterface {
  isLoading: boolean;
}
const indexRoute = getRouteApi("/");

export function CategoriesToggle({ isLoading }: CategoriesToggleInterface) {
  const { filters } = indexRoute.useSearch();

  const categoriesToggles = [
    {
      id: "school",
      value: "school",
      ariaLabel: "Toggle schools",
      label: "Schools",
      icon: <University />,
      color: "text-marker-purple",
    },
    {
      id: "kindergarden",
      value: "kindergarden",
      ariaLabel: "Toggle kindergardens",
      label: "Kindergardens",
      icon: <School />,
      color: "text-marker-green",
    },
    {
      id: "youth_vocational_assistance",
      value: "youth_vocational_assistance",
      ariaLabel: "Toggle Youth Vocational Assistances",
      label: "Social Teenager Projects",
      icon: <User />,
      color: "text-marker-orange",
    },
    {
      id: "school_social_work",
      value: "school_social_work",
      ariaLabel: "Toggle School Social Works",
      label: "Social Child Projects",
      icon: <GraduationCap />,
      color: "text-marker-blue",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 items-center gap-2 lg:max-w-4xl">
        {new Array(4).fill(null).map((_, index) => (
          <Skeleton
            key={index}
            className="col-span-2 h-11 min-w-40 rounded-xl lg:col-span-1"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 items-center gap-2 lg:mr-4 lg:max-w-4xl">
      <Link
        title="Location"
        search={(prev) => ({
          ...prev,
          filterPanel: {
            mode: "EDIT",
          },
        })}
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          "col-span-4 flex space-x-2 rounded-full text-[#ea4335] shadow-xl hover:shadow-2xl"
        )}
      >
        <MapPin className="h-4 w-4 shrink-0" />
        <span className="truncate">{`Location: ${filters.searchLocation.label}`}</span>
      </Link>
      <Link
        title="Location"
        search={(prev) => ({
          ...prev,
          filterPanel: {
            mode: "EDIT",
          },
        })}
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          "col-span-4 flex space-x-2 rounded-full shadow-xl hover:shadow-2xl",
          filters.searchRadius && "text-pink-500"
        )}
      >
        <CircleDotDashed className="h-4 w-4 shrink-0" />
        <span className="truncate">
          {filters.searchRadius
            ? `Radius: ${filters.searchRadius / 1000} Km`
            : "Radius: None"}
        </span>
      </Link>
      <Link
        title="Location"
        search={(prev) => ({
          ...prev,
          filterPanel: {
            mode: "EDIT",
          },
        })}
        className={cn(
          buttonVariants({
            variant: "outline",
          }),
          "col-span-4 flex space-x-2 rounded-full shadow-xl hover:shadow-2xl",
          filters.showOnlyFavorites && "text-green-500"
        )}
      >
        <Heart className="h-4 w-4 shrink-0" />
        <span className="truncate">Show only favorites</span>
      </Link>
      {categoriesToggles.map((category) => {
        const Icon = cloneElement(category.icon, {
          className: "h-4 w-4 shrink-0",
        });
        return (
          <Link
            key={category.id}
            aria-label={category.ariaLabel}
            search={(prev) => ({
              ...prev,
              filterPanel: {
                mode: "EDIT",
              },
            })}
            title={category.label}
            className={cn(
              buttonVariants({
                variant: "outline",
              }),
              "col-span-3 flex space-x-2 rounded-full shadow-xl hover:shadow-2xl",
              (!filters.facilityTypes ||
                filters.facilityTypes.includes(
                  category.value as FacilityType
                )) &&
                category.color
            )}
          >
            {Icon}
            <span className="truncate">{category.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
