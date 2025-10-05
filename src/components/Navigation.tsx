import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { HackerButton, GlitchText, Badge } from "./ui";
import SignoutButton from "./SignoutButton";
import ClientNavigation from "./ClientNavigation";
import { Terminal, Shield, Heart, CheckSquare, Download } from "lucide-react";

export default async function Navigation() {
  const user = await getCurrentUser();

  // Renderizar la navegación del lado del servidor para SEO y performance inicial
  // El componente cliente se hidratará y tomará el control
  return (
    <>
      {/* Server-side navigation for initial render */}
      <nav className="bg-black border-b border-[#00ff41]/30 shadow-2xl backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold">
                <GlitchText 
                  trigger="hover" 
                  intensity="medium"
                  className="text-[#00ff41] terminal-text"
                >
                  TaSave
                </GlitchText>
              </Link>
              {user && (
                <div className="ml-10 flex items-baseline space-x-2">
                  <Link href="/dashboard">
                    <HackerButton variant="ghost" size="sm">
                      <Terminal className="w-4 h-4 mr-2" />
                      Dashboard
                    </HackerButton>
                  </Link>
                  <Link href="/auto-deploy">
                    <HackerButton variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Auto Deploy
                    </HackerButton>
                  </Link>
                  <Link href="/favorites">
                    <HackerButton variant="ghost" size="sm">
                      <Heart className="w-4 h-4 mr-2" />
                      Favorites
                    </HackerButton>
                  </Link>
                  <Link href="/todos">
                    <HackerButton variant="ghost" size="sm">
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Todo List
                    </HackerButton>
                  </Link>
                  <Link href="/showcase">
                    <HackerButton variant="matrix" size="sm">
                      <Shield className="w-4 h-4 mr-2" />
                      UI Showcase
                    </HackerButton>
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success">Online</Badge>
                    <span className="text-sm text-[#00ff41]">
                      Welcome, <GlitchText trigger="hover" className="text-[#00ff41]">{user.username}</GlitchText>
                    </span>
                  </div>
                  <SignoutButton />
                </>
              ) : (
                <>
                  <Link href="/auth?mode=signin">
                    <HackerButton variant="outline" size="sm">
                      Sign in
                    </HackerButton>
                  </Link>
                  <Link href="/auth?mode=signup">
                    <HackerButton variant="default" size="sm">
                      Sign up
                    </HackerButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Client-side navigation overlay for enhanced interactions */}
      <div className="hidden">
        <ClientNavigation />
      </div>
    </>
  );
}
