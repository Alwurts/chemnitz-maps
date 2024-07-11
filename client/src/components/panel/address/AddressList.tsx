import { useDeleteAddress, useGetAddresses } from "@/services/address";
import { Link } from "@tanstack/react-router";

import { ErrorMessage } from "@/components/ErrorMessage";
import { DeleteButton } from "@/components/button/DeleteButton";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Home } from "lucide-react";

export function AddressList() {
  const addresses = useGetAddresses();
  const deleteAddress = useDeleteAddress();
  return (
    <div className="mx-5 my-6 flex flex-col space-y-3 overflow-y-auto">
      <div className="flex items-center space-x-2">
        <h2 className="mx-1 text-xl font-semibold">My Addresses</h2>
        <Link
          search={(prev) => ({
            ...prev,
            addressPanel: {
              type: "CREATE",
            },
          })}
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Create Address
        </Link>
      </div>
      <ErrorMessage error={deleteAddress.error} />
      <Separator />
      <div>
        {addresses.data?.length ? (
          addresses.data.map((address) => (
            <div className="flex flex-col" key={address.id}>
              <div className="flex space-x-2">
                <Home className="h-7 w-7 text-primary" />
                <h3 className="text-lg font-bold">{address.label}</h3>
              </div>

              <div className="my-2 flex flex-col">
                <p>{`Latitude: ${address.latitude}`}</p>
                <p>{`Longitude: ${address.longitude}`}</p>
              </div>
              <Link
                search={(prev) => ({
                  ...prev,
                  addressPanel: {
                    type: "EDIT",
                    id: address.id,
                  },
                })}
                className={buttonVariants({
                  variant: "outline",
                  size: "sm",
                  className: "my-2",
                })}
              >
                Edit
              </Link>
              {addresses.data.length > 1 && (
                <DeleteButton
                  onDelete={async () => {
                    await deleteAddress.mutateAsync(address.id);
                  }}
                >
                  Delete Address
                </DeleteButton>
              )}
              <Separator className="my-3" />
            </div>
          ))
        ) : (
          <div className="flex justify-center py-10">
            <p>No addresses</p>
          </div>
        )}
      </div>
    </div>
  );
}
