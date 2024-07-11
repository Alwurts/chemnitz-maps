import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

export function TypeLabel({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  let showTitle: string = type;
  switch (type) {
    case "school":
      showTitle = "School";
      break;
    case "kindergarden":
      showTitle = "Kindergarden";
      break;
    case "youth_vocational_assistance":
      showTitle = "Social Teenager Projects";
      break;
    case "school_social_work":
      showTitle = "Social Child Projects";
      break;
  }

  return (
    <Badge
      variant="default"
      className={cn("text-base", className, {
        "bg-marker-purple": type === "school",
        "bg-marker-green": type === "kindergarden",
        "bg-marker-orange": type === "youth_vocational_assistance",
        "bg-marker-blue": type === "school_social_work",
      })}
    >
      {showTitle}
    </Badge>
  );
}
