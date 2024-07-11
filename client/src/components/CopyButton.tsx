import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import { Check, Clipboard } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(className)}
    >
      {copied ? (
        <Check className="h-6 w-6 text-primary" />
      ) : (
        <Clipboard className="h-6 w-6 text-primary" />
      )}
    </Button>
  );
}
