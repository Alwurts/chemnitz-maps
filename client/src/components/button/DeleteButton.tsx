import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

import { TrashIcon } from "lucide-react";

interface DeleteButtonProps {
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  buttonClassName?: string;
  button?: React.ReactNode;
  children?: React.ReactNode;
}

export function DeleteButton({
  onDelete,
  button,
  buttonClassName,
  children,
}: DeleteButtonProps) {
  return (
    <AlertDialog>
      {button ? (
        <AlertDialogTrigger asChild>{button}</AlertDialogTrigger>
      ) : (
        <AlertDialogTrigger
          className={buttonVariants({
            variant: "destructive",
            className: buttonClassName,
          })}
        >
          <TrashIcon className="mr-1 h-5 w-5" />
          {children ? children : "Delete Account"}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone..
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({
              variant: "destructive",
            })}
            onClick={onDelete}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
