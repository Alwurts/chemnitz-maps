import { useUpgradeAccount } from "@/services/auth";

import { Button } from "@/components/ui/button";

import { Star } from "lucide-react";

interface UpgradeAccountButtonProps {
  className?: string;
}

export function UpgradeAccountButton({ className }: UpgradeAccountButtonProps) {
  const upgradeAccount = useUpgradeAccount();

  return (
    <Button
      type="button"
      className={className}
      size="sm"
      variant="outline"
      onClick={() => {
        upgradeAccount.mutate();
      }}
    >
      <Star className="mr-1.5 h-6 w-6 text-yellow-400" />
      Upgrade account to Premium
    </Button>
  );
}
