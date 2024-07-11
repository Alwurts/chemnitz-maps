import { useChangePassword } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ErrorMessage } from "@/components/ErrorMessage";
import { LayoutCard } from "@/components/layout/CardLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { defaultFilters } from "@/lib/filters";

export const Route = createLazyFileRoute("/auth/password")({
  component: PasswordChange,
});

function PasswordChange() {
  const changePassword = useChangePassword();
  const navigate = useNavigate();

  const formSchema = z.object({
    oldPassword: z.string().min(2),
    newPassword: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
    repeatNewPassword: z.string().min(8, {
      message: "Password must be at least 8 characters long",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await changePassword.mutateAsync(values);
    navigate({
      to: "/",
      search: {
        profilePanel: {
          mode: "EDIT",
        },
        filters: defaultFilters,
      },
    });
  }

  return (
    <LayoutCard
      title="Change Password"
      description="Make sure to use a strong password."
      goBack={{
        to: "/",
        search: {
          profilePanel: {
            mode: "EDIT",
          },
          filters: defaultFilters,
        },
      }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-x-3 gap-y-1"
        >
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Current Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="repeatNewPassword"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Repeat New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ErrorMessage error={changePassword.error} />
          <Button
            disabled={
              !form.formState.isDirty ||
              changePassword.isPending ||
              changePassword.isSuccess
            }
            type="submit"
            className="col-span-2 mt-3 w-full"
          >
            Save changes
          </Button>
        </form>
      </Form>
    </LayoutCard>
  );
}
