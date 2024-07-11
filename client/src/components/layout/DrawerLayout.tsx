import { useMediaQuery } from "@/hooks/useMediaQuery";

import { cn } from "@/lib/utils";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface DetailPanelProps {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  drawerHeight?: string;
  drawerAction?: React.ReactNode;
}

export function DrawerLayout({
  children,
  open,
  setOpen,
  drawerHeight,
  drawerAction,
}: DetailPanelProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)"); // md breakpoint

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-5/6 flex-col p-0 sm:max-w-[425px]">
          {children}
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent
        className={cn("flex flex-col", drawerHeight ? drawerHeight : "h-5/6")}
      >
        {children}
        <div className="fixed bottom-7 right-5 z-30 lg:bottom-10 lg:right-12">
          {drawerAction}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
