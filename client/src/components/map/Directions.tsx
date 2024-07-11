import { useEffect, useState } from "react";

import { TLocationFacility } from "@/types/models";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

import { TSearchAddress } from "@/lib/zod/address";

interface DirectionsProps {
  fromLocation: TSearchAddress;
  toLocation: TLocationFacility;
}

export function Directions({ fromLocation, toLocation }: DirectionsProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
  }, [routesLibrary, map]);

  // Use directions service
  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin: {
          lat: fromLocation.latitude,
          lng: fromLocation.longitude,
        },
        destination: {
          lat: toLocation.latitude,
          lng: toLocation.longitude,
        },
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
        //setRoutes(response.routes);
      });

    return () => directionsRenderer.setMap(null);
  }, [
    directionsService,
    directionsRenderer,
    fromLocation.latitude,
    fromLocation.longitude,
    toLocation.latitude,
    toLocation.longitude,
  ]);
  return null;
}
