import { Facility } from "@/types/models";
import { getDistance } from "geolib";

export const chemnitzLocation = {
  latitude: 50.829195417880044,
  longitude: 12.921127560115142,
};

export const locationToLatLng = (location: {
  latitude: number;
  longitude: number;
}) => {
  return {
    lat: location.latitude,
    lng: location.longitude,
  };
};

export const getLocation = (): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
}> => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          reject(error.message);
        },
        {
          enableHighAccuracy: true,
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};

export function getLocationsWithinRadius(
  from: {
    latitude: number;
    longitude: number;
  },
  radius: number,
  locations: Facility[]
) {
  return locations.filter((facility) => {
    const distance = getDistance(from, facility);

    if (distance <= radius) {
      return facility;
    }
    return false;
  });
}
