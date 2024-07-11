import { useEffect, useState } from "react";

import { useGetFacility } from "@/services/facilities";
import { TSelectedFacility } from "@/types/models";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { getDistance } from "geolib";

import { facilitiesIcons } from "@/lib/facilitiesIcons";

import CopyButton from "@/components/CopyButton";
import { LikeButton } from "@/components/button/LikeButton";
import { SourceLink } from "@/components/facility/SourceLink";
import { TypeLabel } from "@/components/facility/TypeLabel";
import { DrawerLayout } from "@/components/layout/DrawerLayout";
import { DetailSkeleton } from "@/components/skeleton/DetailSkeleton";
import { Separator } from "@/components/ui/separator";

import { Globe, Mail, MapPin, Phone, ScatterChart } from "lucide-react";

interface DetailPanelProps {
  selectedFacility: TSelectedFacility | undefined;
}

export function DetailPanel({ selectedFacility }: DetailPanelProps) {
  const navigate = useNavigate();

  return (
    <DrawerLayout
      open={!!selectedFacility}
      setOpen={(open) => {
        if (!open) {
          navigate({
            search: (searchParams) => ({
              ...searchParams,
              selectedFacility: undefined,
            }),
          });
        }
      }}
    >
      {!!selectedFacility && <DetailView selectedFacility={selectedFacility} />}
    </DrawerLayout>
  );
}

const indexRoute = getRouteApi("/");

function DetailView({
  selectedFacility,
}: {
  selectedFacility: TSelectedFacility;
}) {
  const facilityDetail = useGetFacility(selectedFacility);
  const { filters } = indexRoute.useSearch();

  const geocodeLibrary = useMapsLibrary("geocoding");
  const [geoCodeService, setGeoCodeService] = useState<google.maps.Geocoder>();

  useEffect(() => {
    if (!geocodeLibrary) {
      console.log("No geocoder library")
      return;
    }
    setGeoCodeService(new geocodeLibrary.Geocoder());
  }, [geocodeLibrary]);

  useEffect(() => {
    if (!geoCodeService || !facilityDetail.data) {
      return;
    }
    geoCodeService
      .geocode({
        location: {
          lat: facilityDetail.data.latitude,
          lng: facilityDetail.data.longitude,
        },
      })
      .then((result) => {
        console.log("GeoCodeResult", result);
      });
  }, [facilityDetail.data, geoCodeService, geocodeLibrary]);

  if (facilityDetail.isLoading || !facilityDetail.data) {
    return <DetailSkeleton />;
  }

  const title = facilityDetail.data
    ? "short_name" in facilityDetail.data
      ? facilityDetail.data.short_name
      : "name" in facilityDetail.data
        ? facilityDetail.data.name
        : facilityDetail.data?.street
    : "";

  const street =
    facilityDetail.data.type === "kindergarden"
      ? `${facilityDetail.data.street} ${facilityDetail.data.house_number}, ${facilityDetail.data.postal_code} ${facilityDetail.data.city}, Germany`
      : `${facilityDetail.data.street}, ${facilityDetail.data.postal_code} ${facilityDetail.data.city}, Germany`;

  return (
    <div className="mt-4 flex flex-col overflow-y-auto">
      <div className="space-y-3 px-4">
        <div className="flex items-center space-x-3">
          <img
            className="shrink-0"
            src={
              facilityDetail.data.is_favorite
                ? facilitiesIcons[facilityDetail.data.type + "_like"]
                : facilitiesIcons[facilityDetail.data.type]
            }
            width={30}
            height={30}
          />
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <TypeLabel type={facilityDetail.data.type} />
        <p className="ml-2 font-semibold">
          {`${getDistance(
            {
              latitude: filters.searchLocation.latitude,
              longitude: filters.searchLocation.longitude,
            },
            facilityDetail.data
          )} mts from search location`}
        </p>
      </div>
      <LikeButton
        selectedFacility={facilityDetail.data}
        className="mx-4 my-4"
      />
      <div className="flex-grow overflow-y-auto">
        <Separator />
        <div className="flex items-center space-x-3 px-5 py-3 lg:px-6">
          <MapPin className="h-7 w-7 text-primary" />
          <p className="mx-3">{street}</p>
          <CopyButton text={street} className="ml-auto shrink-0" />
        </div>
        <Separator />

        {"website" in facilityDetail.data && facilityDetail.data.website && (
          <>
            <div className="flex items-center px-5 py-3 lg:px-6">
              <Globe className="h-7 w-7 text-primary" />
              <a
                href={
                  facilityDetail.data.website.startsWith("http")
                    ? facilityDetail.data.website
                    : `http://${facilityDetail.data.website}`
                }
                target="_blank"
                className="mx-3 underline"
              >
                {facilityDetail.data.website}
              </a>
              <CopyButton
                text={facilityDetail.data.website}
                className="ml-auto shrink-0"
              />
            </div>
            <Separator />
          </>
        )}
        {facilityDetail.data.email && (
          <>
            <div className="flex items-center px-5 py-3 lg:px-6">
              <Mail className="h-7 w-7 text-primary" />
              <a
                href={`mailto:${facilityDetail.data.email}`}
                target="_blank"
                className="mx-3 underline"
              >
                {facilityDetail.data.email}
              </a>
              <CopyButton
                text={facilityDetail.data.email}
                className="ml-auto shrink-0"
              />
            </div>
            <Separator />
          </>
        )}
        {facilityDetail.data.phone && (
          <>
            <div className="flex items-center px-5 py-3 lg:px-6">
              <Phone className="h-7 w-7 text-primary" />
              <a
                href={`tel:${facilityDetail.data.phone}`}
                target="_blank"
                className="mx-3 underline"
              >
                {facilityDetail.data.phone}
              </a>
              <CopyButton
                text={facilityDetail.data.phone}
                className="ml-auto shrink-0"
              />
            </div>
            <Separator />
          </>
        )}
        <div className="flex items-center px-5 py-3 lg:px-6">
          <ScatterChart className="h-7 w-7 text-primary" />
          <div className="mx-3 flex flex-col">
            <p>{`Latitude: ${facilityDetail.data.latitude}`}</p>
            <p>{`Longitude: ${facilityDetail.data.longitude}`}</p>
          </div>
          <CopyButton
            text={`${facilityDetail.data.latitude}, ${facilityDetail.data.longitude}`}
            className="ml-auto shrink-0"
          />
        </div>
        <Separator />
        <div className="p-4">
          <SourceLink />
        </div>
      </div>
    </div>
  );
}
