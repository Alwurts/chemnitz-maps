import { useMemo } from "react";

import { TDirectionPanel, TDirections } from "@/routes";
import { useGetAddresses } from "@/services/address";
import { useGetFacilities } from "@/services/facilities";
import { Facilities, Facility } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { chemnitzLocation, getLocation } from "@/lib/location";
import { cn } from "@/lib/utils";

import { useAuth } from "@/components/AuthProvider";
import { DrawerLayout } from "@/components/layout/DrawerLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import { KeyRound } from "lucide-react";

interface DirectionsPanelProps {
  directionsPanel: TDirectionPanel;
  directions: TDirections;
}

export function DirectionsPanel({
  directionsPanel,
  directions,
}: DirectionsPanelProps) {
  const navigate = useNavigate();

  return (
    <DrawerLayout
      open={!!directionsPanel}
      setOpen={(open) => {
        if (!open) {
          navigate({
            search: (prev) => ({ ...prev, directionsPanel: undefined }),
          });
        }
      }}
    >
      {!!directionsPanel && (
        <FilterForm directions={directions} directionsPanel={directionsPanel} />
      )}
    </DrawerLayout>
  );
}

function FilterForm({ directions }: DirectionsPanelProps) {
  const { authTokens } = useAuth();

  const addresses = useGetAddresses();

  const facilities = useGetFacilities();

  const navigate = useNavigate();

  const { toast } = useToast();

  const formSchema = z.object({
    fromLocation: z.string(),
    toLocation: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromLocation: directions?.fromLocation.id.toString(),
      toLocation: directions?.toLocation.id.toString(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let fromLocation;
    switch (values.fromLocation) {
      case "chemnitz-center":
        fromLocation = {
          id: "chemnitz-center",
          label: "Chemnitz",
          latitude: chemnitzLocation.latitude,
          longitude: chemnitzLocation.longitude,
        };
        break;
      case "current-location": {
        const liveLocation = await getLocation();
        fromLocation = {
          id: "current-location",
          label: "Current location",
          latitude: liveLocation.latitude,
          longitude: liveLocation.longitude,
        };
        break;
      }
      default:
        fromLocation = addresses.data?.find(
          (address) => address.id === parseInt(values.fromLocation)
        );
    }

    const toLocation = facilitiesToShow.find(
      (facility) => facility.id === parseInt(values.toLocation)
    );

    if (!fromLocation || !toLocation) {
      toast({
        title: "Error",
        description: "Invalid location",
      });
      return;
    }

    const toLocationTitle = toLocation
      ? "short_name" in toLocation
        ? toLocation.short_name
        : "name" in toLocation
          ? toLocation.name
          : toLocation?.street
      : "";

    navigate({
      search: (prev) => ({
        ...prev,
        directions: {
          fromLocation: {
            id: fromLocation.id,
            label: fromLocation.label,
            latitude: fromLocation.latitude,
            longitude: fromLocation.longitude,
          },
          toLocation: {
            id: toLocation.id,
            label: toLocationTitle,
            type: toLocation.type,
            latitude: toLocation.latitude,
            longitude: toLocation.longitude,
          },
        },
        directionsPanel: undefined,
      }),
    });
  }

  const facilitiesToShow = useMemo(() => {
    if (!facilities.data) {
      return [] as Facility[];
    }
    const tempData: Facilities = JSON.parse(JSON.stringify(facilities.data));

    let flattenedData = Object.values(tempData).flat();

    flattenedData = flattenedData.filter((facility) => facility.is_favorite);

    return flattenedData;
  }, [facilities.data]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 p-4">
          <FormField
            control={form.control}
            name="fromLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>From location</FormLabel>
                <Select
                  onValueChange={async (value) => {
                    field.onChange(value);
                    if (value === "current-location") {
                      getLocation().catch(() => {
                        field.onChange("chemnitz-center");
                        toast({
                          title: "Error",
                          description:
                            "Could not get current location from device",
                        });
                      });
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a origin location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="chemnitz-center">
                      Chemnitz center (Default)
                    </SelectItem>
                    <SelectItem value="current-location">
                      Use current location
                    </SelectItem>
                    {authTokens ? (
                      <SelectGroup>
                        <SelectLabel>Saved Addresses</SelectLabel>
                        {addresses.data?.length ? (
                          addresses.data.map((address) => (
                            <SelectItem
                              key={address.id}
                              value={address.id.toString()}
                            >
                              {address.label}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectLabel>No saved addresses</SelectLabel>
                        )}
                      </SelectGroup>
                    ) : (
                      <div className="w-full space-y-2 p-2">
                        <p className="text-sm text-gray-500">
                          Select from a list of saved addresses by login in
                        </p>
                        <Link
                          to="/login"
                          className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          <KeyRound
                            className={cn("mr-1.5 h-6 w-6 text-yellow-400")}
                          />
                          Login to save addresses
                        </Link>
                      </div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="toLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>To Facility</FormLabel>
                <Select
                  onValueChange={async (value) => {
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a destination facility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      <SelectGroup>
                        <SelectLabel>Facilities</SelectLabel>
                        {facilitiesToShow.length ? (
                          facilitiesToShow.map((facility) => {
                            const facilityTitle = facility
                              ? "short_name" in facility
                                ? facility.short_name
                                : "name" in facility
                                  ? facility.name
                                  : facility?.street
                              : "";
                            return (
                              <SelectItem
                                key={facility.id}
                                value={facility.id.toString()}
                              >
                                {facilityTitle}
                              </SelectItem>
                            );
                          })
                        ) : (
                          <SelectLabel>No saved addresses</SelectLabel>
                        )}
                      </SelectGroup>
                    }
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit" className="mt-3 w-full">
              Get directions
            </Button>
            <Link
              search={(prev) => ({ ...prev, filterPanel: undefined })}
              className={buttonVariants({
                variant: "outline",
                className: "mt-3 w-full",
              })}
            >
              Cancel
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
