"use client";

import { useTransition } from "react";
import { signin } from "@/lib/actions/auth";
import Button from "./ui/Button";

export default function SigninForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      signin(formData);
    });
  };

  return (
    <form action={handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            disabled={isPending}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-green-500 bg-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm disabled:opacity-50"
            placeholder="Username"
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={isPending}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-400 text-green-500 bg-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm disabled:opacity-50"
            placeholder="Password"
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
          size="lg"
          className="group relative w-full flex justify-center"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            "&gt; Sign in"
          )}
        </Button>
      </div>
    </form>
  );
}