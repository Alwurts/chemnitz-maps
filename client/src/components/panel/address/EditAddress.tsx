import { ErrorMessage } from "@/components/ErrorMessage";
import { buttonVariants, Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TAddressPanel, TSelectMode } from "@/routes";
import { useGetAddress, useUpdateAddress } from "@/services/address";
import { zodResolver } from "@hookform/resolvers/zod";
import { LocateFixed } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface AddressEditProps {
  addressPanel: TAddressPanel;
  selectMode: TSelectMode;
}

export function AddressEdit({ addressPanel, selectMode }: AddressEditProps) {
  const updateAddress = useUpdateAddress();
  const address = useGetAddress(
    addressPanel?.type === "EDIT" ? addressPanel?.id : undefined
  );
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
    values: {
      label: address?.data?.label ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (addressPanel?.type === "EDIT") {
      if (
        selectMode?.mode === "USE" &&
        selectMode?.latitude &&
        selectMode?.longitude
      ) {
        await updateAddress.mutateAsync({
          id: addressPanel.id,
          label: values.label,
          latitude: selectMode.latitude,
          longitude: selectMode.longitude,
        });
      } else {
        await updateAddress.mutateAsync({
          id: addressPanel.id,
          label: values.label,
        });
      }
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

  if (addressPanel?.type !== "EDIT") {
    return null;
  }

  return (
    <div className="mx-5 my-6 flex flex-col space-y-3 overflow-y-auto">
      <h2 className="mx-1 text-xl font-semibold">Edit Address</h2>

      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mx-1 space-y-2">
          {((address.data?.latitude && address.data.longitude) ||
            (selectMode?.mode === "USE" &&
              selectMode?.latitude &&
              selectMode?.longitude)) && (
            <iframe
              className="h-60 w-full"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen={false}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_MAPS_API_KEY}&q=${selectMode?.latitude ?? address.data?.latitude},${selectMode?.longitude ?? address.data?.longitude}&center=${selectMode?.latitude ?? address.data?.latitude},${selectMode?.longitude ?? address.data?.longitude}&zoom=17`}
            ></iframe>
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
            Change location
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
          <ErrorMessage error={updateAddress.error} />
          <Button
            disabled={!form.formState.isDirty && !selectMode}
            type="submit"
            className="col-span-2 mt-3 w-full"
          >
            Save changes
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
