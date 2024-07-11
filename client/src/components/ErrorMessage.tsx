import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  className?: string;
}

export function ErrorMessage({ error, className }: ErrorMessageProps) {
  if (!error) return null;

  let errorMessage = "An error occurred";

  if (error.message) {
    errorMessage = error.message;
  }

  if (
    error.response?.status === 400 &&
    error.response?.data === "Passwords do not match."
  ) {
    errorMessage = "New and repeated passwords do not match.";
  }

  if (
    error.response?.status === 400 &&
    error.response?.data === "Current password is incorrect."
  ) {
    errorMessage = "Current password is incorrect.";
  }

  if (
    error.response?.status === 403 &&
    error.response?.data ===
      "Basic users can only have a maximum of 1 favorite."
  ) {
    errorMessage =
      "Basic users can only have 1 favorite. Upgrade to a premium account to save more than one favorite.";
  }

  if (
    error.response?.status === 403 &&
    error.response?.data === "Basic users can only have one address."
  ) {
    errorMessage =
      "Basic users can only have 1 address saved. Upgrade to a premium account to save more than one address.";
  }

  if (
    error.response?.status === 403 &&
    error.response?.data === "You cannot delete your last address."
  ) {
    errorMessage = error.response?.data;
  }

  if (error.response?.status === 401 || error.message.includes("401")) {
    errorMessage = "Invalid credentials";
  }

  return (
    <div className={cn("col-span-2 text-red-500", className)}>
      {errorMessage}
    </div>
  );
}
