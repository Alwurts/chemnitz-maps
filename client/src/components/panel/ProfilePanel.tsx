import {
  useDeleteProfile,
  useEditProfile,
  useGetProfile,
  useUpgradeAccount,
} from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { defaultFilters } from "@/lib/filters";

import { useAuth } from "@/components/AuthProvider";
import { ErrorMessage } from "@/components/ErrorMessage";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { KeyIcon, Star, StarIcon } from "lucide-react";

import { DeleteButton } from "../button/DeleteButton";

interface ProfilePanelProps {
  open: boolean;
}

export function ProfilePanel({ open }: ProfilePanelProps) {
  const navigate = useNavigate();

  return (
    <DrawerLayout
      open={open}
      setOpen={(open) => {
        if (!open) {
          navigate({
            search: (searchParams) => ({
              ...searchParams,
              profilePanel: undefined,
            }),
          });
        }
      }}
      drawerHeight="h-[98dvh]"
    >
      {open && <ProfileDetail />}
    </DrawerLayout>
  );
}

function ProfileDetail() {
  const { logout, authTokens } = useAuth();
  const profile = useGetProfile();
  const editProfile = useEditProfile();
  const deleteProfile = useDeleteProfile();
  const upgradeAccount = useUpgradeAccount();

  const navigate = useNavigate();

  const formSchema = z.object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    values: {
      firstName: profile.data?.first_name ?? "",
      lastName: profile.data?.last_name ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await editProfile.mutateAsync(values);
  }

  return (
    <div className="mx-5 my-6 flex flex-col space-y-3 overflow-y-auto">
      <h2 className="mx-1 text-xl font-semibold">Profile</h2>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-x-3 gap-y-2 px-1"
        >
          <FormItem className="col-span-2">
            <FormLabel>User type</FormLabel>
            <p className="flex">
              {authTokens?.userType === "premium" && (
                <StarIcon className="mr-1.5 h-6 w-6 text-yellow-400" />
              )}
              {authTokens?.userType}
            </p>
            {authTokens?.userType === "basic" && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  upgradeAccount.mutate();
                }}
              >
                <Star className="mr-1.5 h-6 w-6 text-yellow-400" />
                Upgrade account to Premium
              </Button>
            )}
          </FormItem>

          <FormItem className="col-span-2">
            <FormLabel>Username</FormLabel>
            <p>{profile.data?.username}</p>
          </FormItem>

          <FormItem className="col-span-2">
            <FormLabel>Email</FormLabel>

            <p>{profile.data?.email}</p>
          </FormItem>

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Darth" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Vader" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ErrorMessage error={editProfile.error || profile.error} />
          <Button
            disabled={!form.formState.isDirty}
            type="submit"
            className="col-span-2 mt-3 w-full"
          >
            Save changes
          </Button>
        </form>
      </Form>
      <Separator className="col-span-2" />
      <Link
        to="/auth/password"
        className={buttonVariants({
          variant: "outline",
          className: "col-span-2 mx-1",
        })}
      >
        <KeyIcon className="mr-1 h-5 w-5" />
        Change Password
      </Link>
      <Separator className="col-span-2" />
      <DeleteButton
        buttonClassName="col-span-2 mx-1"
        onDelete={async (e) => {
          e.preventDefault();
          await deleteProfile.mutateAsync();
          await logout();
          navigate({
            to: "/",
            search: {
              filters: defaultFilters,
            },
          });
        }}
      />
    </div>
  );
}
