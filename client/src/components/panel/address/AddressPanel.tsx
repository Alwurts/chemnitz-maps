import { TAddressPanel, TSelectMode } from "@/routes";
import { useNavigate } from "@tanstack/react-router";

import { DrawerLayout } from "@/components/layout/DrawerLayout";
import { AddressEdit } from "@/components/panel/address/EditAddress";
import { AddressCreate } from "@/components/panel/address/CreateAddress";
import { AddressList } from "@/components/panel/address/AddressList";

interface AddressPanelProps {
  addressPanel: TAddressPanel;
  selectMode: TSelectMode;
}

export function AddressPanel({ addressPanel, selectMode }: AddressPanelProps) {
  const navigate = useNavigate();

  return (
    <DrawerLayout
      open={!!addressPanel}
      setOpen={(prevOpen) => {
        if (!prevOpen) {
          navigate({
            search: (searchParams) => ({
              ...searchParams,
              addressPanel: undefined,
              selectMode: undefined,
            }),
          });
        }
      }}
      drawerHeight="h-[98dvh]"
    >
      {addressPanel?.type === "LIST" && <AddressList />}
      {addressPanel?.type === "CREATE" && (
        <AddressCreate addressPanel={addressPanel} selectMode={selectMode} />
      )}
      {addressPanel?.type === "EDIT" && (
        <AddressEdit addressPanel={addressPanel} selectMode={selectMode} />
      )}
    </DrawerLayout>
  );
}
