import { badgeVariants } from "@/components/ui/badge";

export function SourceLink() {
  return (
    <a
      className={badgeVariants({
        variant: "secondary",
      })}
      href="https://portal-chemnitz.opendata.arcgis.com/"
    >
      Data sourced from the Chemnitz Open Data Portal
    </a>
  );
}
