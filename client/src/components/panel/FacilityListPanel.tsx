import { useEffect, useState } from "react";

import { Facility } from "@/types/models";
import { Link, useNavigate } from "@tanstack/react-router";

import { facilitiesIcons } from "@/lib/facilitiesIcons";

import { TypeLabel } from "@/components/facility/TypeLabel";
import { MdiHeart } from "@/components/icons/MdiHeart";
import { DrawerLayout } from "@/components/layout/DrawerLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Map } from "lucide-react";

interface FacilityListPanelProps {
  facilitiesToShow: Facility[];
  open: boolean;
}

export function FacilityListPanel({
  open,
  facilitiesToShow,
}: FacilityListPanelProps) {
  const navigate = useNavigate();

  return (
    <DrawerLayout
      open={open}
      setOpen={(open) => {
        if (!open) {
          navigate({
            search: (searchParams) => ({
              ...searchParams,
              showList: undefined,
            }),
          });
        }
      }}
      drawerHeight="h-[98dvh]"
      drawerAction={
        <Link
          search={(searchParams) => ({
            ...searchParams,
            showList: undefined,
          })}
          className={buttonVariants({
            variant: "outline",
            size: "lg",
          })}
        >
          <Map className="mr-2 h-4 w-4" />
          Map
        </Link>
      }
    >
      <FacilityList facilities={facilitiesToShow} />
    </DrawerLayout>
  );
}

function FacilityList({ facilities }: { facilities: Facility[] }) {
  const [visibleFacilities, setVisibleFacilities] = useState<Facility[]>(
    facilities.slice(0, 10)
  );

  const loadMore = () => {
    setVisibleFacilities((prev) => {
      const nextFacilities = facilities.slice(prev.length, prev.length + 10);
      return [...prev, ...nextFacilities];
    });
  };

  useEffect(() => {
    setVisibleFacilities(facilities.slice(0, 10));
  }, [facilities]);

  return (
    <div className="mt-4 flex flex-col overflow-y-auto md:mt-10">
      {visibleFacilities.map((facility) => {
        const title = facility
          ? "short_name" in facility
            ? facility.short_name
            : "name" in facility
              ? facility.name
              : facility?.street
          : "";

        const street =
          facility.type === "kindergarden"
            ? `${facility.street} ${facility.house_number}, ${facility.postal_code} ${facility.city}, Germany`
            : `${facility.street}, ${facility.postal_code} ${facility.city}, Germany`;

        return (
          <div
            key={`${facility.type}-${facility.id}`}
            className="flex flex-col space-y-2"
          >
            <div className="space-y-2 px-5 py-1">
              <div className="flex items-center">
                <img
                  src={facilitiesIcons[facility.type]}
                  alt={facility.type}
                  className="h-8 w-8"
                />
                <Link
                  search={(searchParams) => ({
                    ...searchParams,
                    selectedFacility: {
                      id: facility.id,
                      type: facility.type,
                    },
                  })}
                  className="ml-4 mr-4"
                >
                  <h2 className="text-lg font-bold">{title}</h2>
                </Link>
                {facility.is_favorite === true && (
                  <MdiHeart className="ml-auto h-7 w-7 text-pink-600" />
                )}
              </div>
              <TypeLabel type={facility.type} />

              <p className="text-gray-500">{street}</p>
              <Separator />
            </div>
          </div>
        );
      })}
      {visibleFacilities.length < facilities.length && (
        <Button
          variant="ghost"
          size="lg"
          onClick={loadMore}
          className="mx-4 my-2 h-16 shrink-0"
        >
          Load More
        </Button>
      )}
    </div>
  );
}
