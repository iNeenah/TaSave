"use client";

import { useTransition } from "react";
import { signout } from "@/lib/actions/auth";
import Button from "./ui/Button";

export default function SignoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignout = () => {
    startTransition(() => {
      signout();
    });
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      size="sm"
      onClick={handleSignout}
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}