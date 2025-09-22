import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Button from "./ui/Button";
import SignoutButton from "./SignoutButton";

export default async function Navigation() {
  const user = await getCurrentUser();

  return (
    <nav className="bg-black border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-green-500 terminal-text">
              TaSave
            </Link>
            {user && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/dashboard"
                  className="text-green-500 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-800"
                >
                  Dashboard
                </Link>
                <Link
                  href="/favorites"
                  className="text-green-500 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-800"
                >
                  Favorites
                </Link>
                <Link
                  href="/todos"
                  className="text-green-500 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-800"
                >
                  Todo List
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-green-500">
                  Welcome, <span className="text-green-400">{user.username}</span>
                </span>
                <SignoutButton />
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
