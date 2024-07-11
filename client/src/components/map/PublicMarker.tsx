import { ComponentProps } from "react";

import { Facility } from "@/types/models";
import { Marker } from "@vis.gl/react-google-maps";

import { facilitiesIcons } from "@/lib/facilitiesIcons";
import { locationToLatLng } from "@/lib/location";

type PublicMarkerInterface = {
  facility: Facility;
} & ComponentProps<typeof Marker>;

export function PublicMarker({
  facility,
  ...restOfProps
}: PublicMarkerInterface) {
  return (
    <Marker
      {...restOfProps}
      position={locationToLatLng(facility)}
      icon={
        facility.is_favorite
          ? facilitiesIcons[facility.type + "_like"]
          : facilitiesIcons[facility.type]
      }
    />
  );
}
