import { Link, type LinkProps } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { ArrowLeft } from "lucide-react";

interface LayoutCardProps {
  children: React.ReactNode;
  goBack: { to: LinkProps["to"]; search?: LinkProps["search"] };
  title: string;
  description: string;
}

export function LayoutCard({
  children,
  goBack,
  title,
  description,
}: LayoutCardProps) {
  return (
    <>
      <div className="hidden h-screen flex-col items-center justify-start bg-stone-100 py-14 md:flex">
        <Card className="flex max-h-[86vh] w-1/2 flex-col overflow-y-auto">
          <Link
            {...goBack}
            className={buttonVariants({
              variant: "outline",
              className: "mx-2 my-2 w-fit text-2xl",
            })}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="text-xl">Back</span>
          </Link>
          <Separator />
          <div className="flex-grow overflow-y-auto">
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </div>
        </Card>
      </div>
      <div className="flex w-full flex-col justify-start md:hidden">
        <Link
          {...goBack}
          className={buttonVariants({
            variant: "outline",
            className: "mx-2 my-2 w-fit text-2xl",
          })}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="text-xl">Back</span>
        </Link>
        <Separator />
        <div className="flex-grow overflow-y-auto px-5 py-5">
          <h2 className="text-xl font-semibold">{title}</h2>
          <p>{description}</p>

          <div>{children}</div>
        </div>
      </div>{" "}
    </>
  );
}
