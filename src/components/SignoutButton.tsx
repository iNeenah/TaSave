"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signout } from "@/lib/actions/auth";
import Button from "./ui/Button";
import { useNotifications } from "@/contexts/NotificationContext";

export default function SignoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { success, error } = useNotifications();

  const handleSignout = () => {
    startTransition(async () => {
      try {
        const result = await signout();
        if (result.success) {
          success("See you later!", result.message);
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          error("Error", result.error);
        }
      } catch (err) {
        error("Error", "Error logging out");
      }
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