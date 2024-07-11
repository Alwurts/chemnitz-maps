import { useSignUp } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/components/AuthProvider";
import { ErrorMessage } from "@/components/ErrorMessage";
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

export const Route = createLazyFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const signup = useSignUp();
  const { login } = useAuth();

  const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const signupResponse = await signup.mutateAsync(values);

    if (signupResponse.status === 201) {
      await login(values.username, values.password);
    }
  }

  return (
    <div className="h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid text-center">
            <img src="logo.png" alt="Logo" className="mx-auto h-32 w-32" />
            <span className="up text-2xl font-bold">Chemnitz Maps</span>
          </div>
          {signup.isSuccess ? (
            <>
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Signup successful</h1>
                <p className="text-muted-foreground text-balance">
                  You have successfully created an account
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Signup</h1>
                <p className="text-muted-foreground text-balance">
                  Enter your information below to create an account
                </p>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid grid-cols-2 gap-x-3 gap-y-1 px-5"
                >
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Max" {...field} />
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
                          <Input placeholder="Mustermann" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="mapfanatic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <ErrorMessage error={signup.error} />
                  <Button
                    disabled={signup.isPending}
                    type="submit"
                    className="col-span-2 mt-3 w-full"
                  >
                    Create an account
                  </Button>
                </form>
              </Form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="bg-muted hidden lg:block">
        <img
          src="chemnitzmap.png"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
