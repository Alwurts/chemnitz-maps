import { TSelectMode } from "@/routes";
import { Facility } from "@/types/models";
import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

import { chemnitzLocation } from "@/lib/location";

import { Circle } from "@/components/map/Circle";
import { PublicMarker } from "@/components/map/PublicMarker";

import { Directions } from "./Directions";

interface InteractiveMapInterface {
  facilitiesToShow: Facility[];
  selectMode: TSelectMode;
}
const indexRoute = getRouteApi("/");

export function InteractiveMap({
  facilitiesToShow,
  selectMode,
}: InteractiveMapInterface) {
  const { filters, directions } = indexRoute.useSearch();

  const navigate = useNavigate();

  return (
    <APIProvider apiKey={import.meta.env.VITE_MAPS_API_KEY}>
      <Map
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{
          lat: chemnitzLocation.latitude,
          lng: chemnitzLocation.longitude,
        }}
        defaultZoom={14}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        onClick={(e) => {
          const latitude = e.detail.latLng?.lat;
          const longitude = e.detail.latLng?.lng;

          if (!latitude || !longitude) {
            throw new Error("No lat or lng");
          }

          if (selectMode?.mode === "SELECT") {
            navigate({
              search: (searchParams) => ({
                ...searchParams,
                selectMode: {
                  mode: "USE",
                  latitude,
                  longitude,
                },
              }),
            });
          }
        }}
      >
        {selectMode?.mode != "SELECT" && !directions && (
          <Marker
            zIndex={50}
            position={{
              lat: filters.searchLocation.latitude + 0.0005,
              lng: filters.searchLocation.longitude,
            }}
          />
        )}
        {!!filters.searchRadius &&
          selectMode?.mode != "SELECT" &&
          !directions && (
            <>
              <Marker
                zIndex={40}
                position={{
                  lat: filters.searchLocation.latitude,
                  lng: filters.searchLocation.longitude,
                }}
                icon="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBzdHJva2U9IiMwZGEyZDMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBkPSJNMTAuMSAyLjE4YTkuOSA5LjkgMCAwIDEgMy44IDBtMy43IDEuNTNhMTAgMTAgMCAwIDEgMi42OSAyLjdtMS41MyAzLjY5YTkuOSA5LjkgMCAwIDEgMCAzLjhtLTEuNTMgMy43YTEwIDEwIDAgMCAxLTIuNyAyLjY5bS0zLjY5IDEuNTNhOS45IDkuOSAwIDAgMS0zLjggMG0tMy43LTEuNTNhMTAgMTAgMCAwIDEtMi42OS0yLjdNMi4xOCAxMy45YTkuOSA5LjkgMCAwIDEgMC0zLjhtMS41My0zLjdhMTAgMTAgMCAwIDEgMi43LTIuNjkiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxIi8+PC9nPjwvc3ZnPg=="
              />
              <Circle
                radius={filters.searchRadius}
                center={{
                  lat: filters.searchLocation.latitude,
                  lng: filters.searchLocation.longitude,
                }}
                strokeColor={"#0c4cb3"}
                strokeOpacity={1}
                strokeWeight={1}
                fillColor={"#3b82f6"}
                fillOpacity={0.08}
              />
            </>
          )}
        {!directions &&
          facilitiesToShow.map((facility) => (
            <PublicMarker
              key={`${facility.type}-${facility.id}`}
              facility={facility}
              onClick={() => {
                navigate({
                  search: (searchParams) => ({
                    ...searchParams,
                    selectedFacility: {
                      id: facility.id,
                      type: facility.type,
                    },
                  }),
                });
              }}
            />
          ))}
        {directions && (
          <Directions
            fromLocation={directions.fromLocation}
            toLocation={directions.toLocation}
          />
        )}
      </Map>
    </APIProvider>
  );
}
