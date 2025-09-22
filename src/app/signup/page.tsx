import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-green-500 terminal-text">
            &gt; Initialize Session
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Or{" "}
            <Link
              href="/signin"
              className="font-medium text-green-500 hover:text-green-400"
            >
              access existing terminal
            </Link>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
