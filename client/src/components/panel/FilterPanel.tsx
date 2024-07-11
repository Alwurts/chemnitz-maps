import { TFilterPanel, TFilters } from "@/routes";
import { useGetAddresses } from "@/services/address";
import { FacilityType } from "@/types/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { chemnitzLocation, getLocation } from "@/lib/location";
import { cn } from "@/lib/utils";
import { filterFacilityTypesSchema } from "@/lib/zod/facility";

import { useAuth } from "@/components/AuthProvider";
import { DrawerLayout } from "@/components/layout/DrawerLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

import { KeyRound } from "lucide-react";

interface FilterPanelProps {
  filterPanel: TFilterPanel;
  filters: TFilters;
}

export function FilterPanel({ filterPanel, filters }: FilterPanelProps) {
  const navigate = useNavigate();

  return (
    <DrawerLayout
      open={!!filterPanel}
      setOpen={(open) => {
        if (!open) {
          navigate({
            search: (prev) => ({ ...prev, filterPanel: undefined }),
          });
        }
      }}
    >
      {!!filterPanel && (
        <FilterForm filters={filters} filterPanel={filterPanel} />
      )}
    </DrawerLayout>
  );
}

function FilterForm({ filters }: FilterPanelProps) {
  const { authTokens } = useAuth();

  const addresses = useGetAddresses();

  const navigate = useNavigate();

  const { toast } = useToast();

  const formSchema = z.object({
    facilityTypes: filterFacilityTypesSchema,
    showOnlyFavorites: z.boolean().optional(),
    searchRadius: z.coerce.number().min(0).max(15000).optional(),
    searchLocation: z.string(),
    useSearchRadius: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facilityTypes: filters?.facilityTypes ?? [],
      showOnlyFavorites: filters?.showOnlyFavorites ?? false,
      searchRadius: filters?.searchRadius ?? 1000,
      searchLocation: filters?.searchLocation.id.toString(),
      useSearchRadius: !!filters?.searchRadius,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let searchLocation;
    switch (values.searchLocation) {
      case "chemnitz-center":
        searchLocation = {
          id: "chemnitz-center",
          label: "Chemnitz",
          latitude: chemnitzLocation.latitude,
          longitude: chemnitzLocation.longitude,
        };
        break;
      case "current-location": {
        const liveLocation = await getLocation();
        searchLocation = {
          id: "current-location",
          label: "Current location",
          latitude: liveLocation.latitude,
          longitude: liveLocation.longitude,
        };
        break;
      }
      default:
        searchLocation = addresses.data?.find(
          (address) => address.id === parseInt(values.searchLocation)
        );
    }

    navigate({
      search: (prev) => ({
        ...prev,
        filters: {
          searchRadius: values.useSearchRadius
            ? values.searchRadius
            : undefined,
          facilityTypes:
            values.facilityTypes.length > 0 ? values.facilityTypes : undefined,
          searchLocation,
          showOnlyFavorites:
            values.showOnlyFavorites === true ? true : undefined,
        },
        filterPanel: undefined,
      }),
    });
  }

  const facilityTypes = [
    { label: "School", value: "school" },
    { label: "Kindergarden", value: "kindergarden" },
    { label: "Social Child Projects", value: "school_social_work" },
    {
      label: "Social Teenager Projects",
      value: "youth_vocational_assistance",
    },
  ];

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 p-4">
          <FormField
            control={form.control}
            name="searchLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search location</FormLabel>
                <Select
                  onValueChange={async (value) => {
                    field.onChange(value);
                    if (value === "current-location") {
                      getLocation().catch(() => {
                        field.onChange("chemnitz-center");
                        toast({
                          title: "Error",
                          description: "Could not get current location from device",
                        })
                      });
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a search location" />
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
                <FormDescription>
                  Select search location to display
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="useSearchRadius"
            render={({ field }) => (
              <FormItem className="space-x-3">
                <FormLabel>Search radius</FormLabel>

                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />

                <FormControl>
                  <FormField
                    control={form.control}
                    name="searchRadius"
                    disabled={!form.watch("useSearchRadius")}
                    render={({ field }) => (
                      <FormItem>
                        {form.watch("useSearchRadius") ? (
                          <h3 className="text-2xl font-semibold">
                            {`${(form.watch("searchRadius") ?? 0) / 1000} Km`}
                          </h3>
                        ) : (
                          <h3 className="text-xl font-semibold">Disabled</h3>
                        )}
                        <FormControl>
                          <Input
                            min={500}
                            max={10000}
                            step={100}
                            type="range"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />
          <FormField
            control={form.control}
            name="facilityTypes"
            render={() => (
              <FormItem>
                <FormLabel className="text-base">Facility Types</FormLabel>
                {facilityTypes.map((facilityType) => (
                  <FormField
                    key={facilityType.value}
                    control={form.control}
                    name="facilityTypes"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={facilityType.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                facilityType.value as FacilityType
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      facilityType.value,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== facilityType.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {facilityType.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <FormField
            control={form.control}
            name="showOnlyFavorites"
            render={({ field }) => (
              <FormItem className="space-x-2">
                <FormLabel>Show only favorites</FormLabel>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <Button type="submit" className="mt-3 w-full">
              Update filters
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
