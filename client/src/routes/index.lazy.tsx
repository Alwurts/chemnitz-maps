import { useMemo } from "react";

import { useGetFacilities } from "@/services/facilities";
import { Facilities, Facility, FacilityType } from "@/types/models";
import { Link, createLazyFileRoute, getRouteApi } from "@tanstack/react-router";

import { getLocationsWithinRadius } from "@/lib/location";

import { CategoriesToggle } from "@/components/CategoriesToggle";
import { DirectionsShow } from "@/components/DirectionsShow";
import { MenuToggle } from "@/components/MenuToggle";
import { UserAvatar } from "@/components/UserAvatar";
import { SourceLink } from "@/components/facility/SourceLink";
import { InteractiveMap } from "@/components/map/Map";
import { DetailPanel } from "@/components/panel/DetailPanel";
import { DirectionsPanel } from "@/components/panel/DirectionsPanel";
import { FacilityListPanel } from "@/components/panel/FacilityListPanel";
import { FilterPanel } from "@/components/panel/FilterPanel";
import { ProfilePanel } from "@/components/panel/ProfilePanel";
import { AddressPanel } from "@/components/panel/address/AddressPanel";
import { buttonVariants } from "@/components/ui/button";

import { CarIcon, List, XIcon } from "lucide-react";

export const Route = createLazyFileRoute("/")({
  component: App,
});
const indexRoute = getRouteApi("/");

function App() {
  const facilities = useGetFacilities();

  const {
    selectedFacility,
    showList,
    filterPanel,
    profilePanel,
    addressPanel,
    selectMode,
    filters,
    directions,
    directionsPanel,
  } = indexRoute.useSearch();

  const facilitiesToShow = useMemo(() => {
    if (!facilities.data) {
      return [] as Facility[];
    }
    const tempData: Facilities = JSON.parse(JSON.stringify(facilities.data));

    if (filters.facilityTypes) {
      Object.keys(tempData).forEach((facilityType) => {
        if (!filters.facilityTypes?.includes(facilityType as FacilityType)) {
          tempData[facilityType as FacilityType] = [];
        }
      });
    }

    let flattenedData = Object.values(tempData).flat();

    if (filters.searchRadius && filters.searchLocation) {
      flattenedData = getLocationsWithinRadius(
        {
          latitude: filters.searchLocation.latitude,
          longitude: filters.searchLocation.longitude,
        },
        filters.searchRadius,
        flattenedData
      );
    }

    if (filters.showOnlyFavorites) {
      flattenedData = flattenedData.filter((facility) => facility.is_favorite);
    }

    return flattenedData;
  }, [
    facilities.data,
    filters.facilityTypes,
    filters.searchRadius,
    filters.searchLocation,
    filters.showOnlyFavorites,
  ]);

  return (
    <>
      {selectMode?.mode !== "SELECT" ? (
        <>
          <DetailPanel selectedFacility={selectedFacility} />
          <FacilityListPanel
            facilitiesToShow={facilitiesToShow}
            open={!!showList}
          />
          <FilterPanel filters={filters} filterPanel={filterPanel} />
          <DirectionsPanel
            directions={directions}
            directionsPanel={directionsPanel}
          />
          <ProfilePanel open={!!profilePanel} />
          <AddressPanel addressPanel={addressPanel} selectMode={selectMode} />
          <div className="fixed inset-x-0 top-6 z-30 mx-6 flex flex-col items-stretch space-y-3 lg:flex-row lg:items-center lg:space-y-0">
            <div className="flex items-center space-x-2 lg:mr-6">
              <MenuToggle />
              <UserAvatar className="lg:hidden" />
            </div>
            {!directions && (
              <CategoriesToggle isLoading={facilities.isLoading} />
            )}
            {!!directions && <DirectionsShow />}
            <UserAvatar className="ml-auto hidden lg:block" />
          </div>
          <div className="fixed bottom-0 left-0 z-30">
            <SourceLink />
          </div>
          <div className="fixed bottom-24 sm:bottom-14 md:bottom-10 right-5 z-30 space-x-2 lg:bottom-10 lg:right-12">
            {!directions && (
              <>
                <Link
                  search={(prev) => ({
                    ...prev,
                    showList: true,
                  })}
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                  })}
                >
                  <List className="mr-2 h-4 w-4" />
                  List
                </Link>
                <Link
                  search={(prev) => ({
                    ...prev,
                    directionsPanel: { mode: "EDIT" },
                  })}
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                  })}
                >
                  <CarIcon className="mr-2 h-4 w-4" />
                  Directions
                </Link>
              </>
            )}
            {directions && (
              <Link
                search={(prev) => ({
                  ...prev,
                  directions: undefined,
                  directionsPanel: undefined,
                })}
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                })}
              >
                <XIcon className="mr-2 h-4 w-4" />
                Finish navigating
              </Link>
            )}
          </div>
        </>
      ) : (
        <div className="fixed bottom-7 right-5 z-30 space-x-2 lg:bottom-10 lg:right-12">
          <Link
            search={(prev) => ({
              ...prev,
              selectMode: undefined,
            })}
            className={buttonVariants({
              variant: "default",
              size: "lg",
            })}
          >
            <XIcon className="mr-2 h-4 w-4" />
            Cancel
          </Link>
        </div>
      )}
      <InteractiveMap
        selectMode={selectMode}
        facilitiesToShow={facilitiesToShow}
      />
    </>
  );
}
