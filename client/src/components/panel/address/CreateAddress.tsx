import { TAddressPanel, TSelectMode } from "@/routes";
import { useCreateAddress } from "@/services/address";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/components/AuthProvider";
import { ErrorMessage } from "@/components/ErrorMessage";
import { UpgradeAccountButton } from "@/components/button/UpgradeAccountButton";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { LocateFixed } from "lucide-react";

interface AddresCreateProps {
  addressPanel: TAddressPanel;
  selectMode: TSelectMode;
}

export function AddressCreate({ addressPanel, selectMode }: AddresCreateProps) {
  const { authTokens } = useAuth();

  const createAddress = useCreateAddress();
  const navigate = useNavigate();

  const formSchema = z.object({
    label: z.string().min(2, {
      message: "Label must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (
      selectMode?.mode === "USE" &&
      selectMode?.latitude &&
      selectMode?.longitude
    ) {
      await createAddress.mutateAsync({
        label: values.label,
        latitude: selectMode.latitude,
        longitude: selectMode.longitude,
      });
      navigate({
        search: (searchParams) => ({
          ...searchParams,
          addressPanel: { type: "LIST" },
          selectMode: undefined,
        }),
      });
    } else {
      throw new Error("No location selected");
    }
  }

  if (addressPanel?.type !== "CREATE") {
    return null;
  }

  return (
    <div className="mx-5 my-6 flex flex-col space-y-3 overflow-y-auto">
      <h2 className="mx-1 text-xl font-semibold">Add Address</h2>

      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-1 space-y-2">
          {selectMode?.mode === "USE" ? (
            <iframe
              className="h-60 w-full"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen={false}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_MAPS_API_KEY}&q=${selectMode.latitude},${selectMode.longitude}&center=${selectMode.latitude},${selectMode.longitude}&zoom=17`}
            ></iframe>
          ) : (
            <div className="ml-1">
              <p>No location set click below to select</p>
            </div>
          )}
          <Link
            search={(prev) => ({
              ...prev,
              selectMode: {
                mode: "SELECT",
              },
            })}
            className={buttonVariants({
              variant: "outline",
            })}
          >
            <LocateFixed className="mr-2 h-4 w-4" />
            {selectMode?.latitude && selectMode?.longitude
              ? "Change location"
              : "Select location"}
          </Link>
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input placeholder="Home" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ErrorMessage error={createAddress.error} />
          {authTokens?.userType === "basic" &&
            // @ts-expect-error - TODO: Fix this type
            createAddress.error?.response.status === 403 && (
              <UpgradeAccountButton />
            )}
          <Button
            disabled={!form.formState.isDirty || !selectMode}
            type="submit"
            className="col-span-2 mt-3 w-full"
          >
            Create address
          </Button>
          <Link
            search={(prev) => ({
              ...prev,
              addressPanel: { type: "LIST" },
              selectMode: undefined,
            })}
            className={buttonVariants({
              variant: "outline",
              className: "w-full",
            })}
          >
            Cancel
          </Link>
        </form>
      </Form>
    </div>
  );
}
