import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  HackerButton,
  GlowCard,
  HolographicCard,
  CyberGrid,
  MatrixRain,
  GlitchText,
  Badge,
  TerminalWindow
} from "@/components/ui";
import Container from "@/components/ui/Container";
import AnimatedPage from "@/components/AnimatedPage";
import Preloader from "@/components/Preloader";
import SmoothScrolling from "@/components/SmoothScrolling";
import { Shield, Terminal, Users, Zap, Database, Code } from "lucide-react";

// Página principal con tema cyberpunk y efectos visuales
export default async function HomePage() {
  // Verificar si el usuario está autenticado
  const user = await getCurrentUser();

  return (
    <>
      <Preloader />
      <SmoothScrolling />
      <MatrixRain intensity="low" />
      <AnimatedPage>
        <div className="bg-black min-h-screen text-green-500 relative z-10">
          {/* Sección principal con video de fondo */}
          <section className="py-20 lg:py-32 relative overflow-hidden">
            {/* Background Video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            >
              <source src="/1.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60"></div>
            <Container className="relative z-10">
              <div className="text-center">
                <div className="mb-8">
                  <h1 className="hero-title text-5xl lg:text-7xl font-bold mb-4">
                    <span className="block text-[#00ff41] terminal-text">
                      &gt; <GlitchText trigger="auto" intensity="medium" className="text-5xl lg:text-7xl">TaSave</GlitchText>
                    </span>
                  </h1>
                  <div className="hero-subtitle text-lg lg:text-xl text-gray-400 mb-2 flex items-center justify-center gap-2">
                    <Badge variant="success">SYSTEM ONLINE</Badge>
                    <span className="text-[#00ff41]">root@tasave:~$</span> initializing cybersecurity_lab...
                  </div>
                  <div className="hero-subtitle text-lg lg:text-xl text-gray-400">
                    <span className="text-[#00ff41]">[OK]</span> Docker machines loaded successfully
                  </div>
                </div>

                <HolographicCard className="max-w-4xl mx-auto mb-10">
                  <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                    Practice cybersecurity with Docker machines. Learn, explore, and
                    master various security challenges in a <GlitchText trigger="hover" className="text-[#00ff41]">safe environment</GlitchText>.
                  </p>
                </HolographicCard>

                <div className="hero-buttons mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  {user ? (
                    <Link href="/dashboard">
                      <HackerButton variant="matrix" size="lg" glitchEffect>
                        <Terminal className="w-5 h-5 mr-2" />
                        Access Dashboard
                      </HackerButton>
                    </Link>
                  ) : (
                    <>
                      <Link href="/signup">
                        <HackerButton variant="default" size="lg" glitchEffect>
                          <Shield className="w-5 h-5 mr-2" />
                          Initialize Session
                        </HackerButton>
                      </Link>
                      <Link href="/signin">
                        <HackerButton variant="outline" size="lg">
                          <Code className="w-5 h-5 mr-2" />
                          Login
                        </HackerButton>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </Container>
          </section>

          {/* Sección de características del sistema */}
          <section className="py-20 bg-gray-950/50 relative overflow-hidden backdrop-blur-sm">
            <Container className="relative z-10">
              <div className="text-center mb-16">
                <h2 className="features-title text-3xl lg:text-4xl font-bold text-[#00ff41] mb-4">
                  <GlitchText trigger="hover" intensity="low">
                    &gt; System Features
                  </GlitchText>
                </h2>
                <p className="features-subtitle text-lg text-gray-400">
                  Everything you need to practice cybersecurity
                </p>
              </div>

              <CyberGrid columns={3} gap={8}>
                <GlowCard intensity="medium">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#00ff41]/20 rounded-lg flex items-center justify-center mr-4">
                      <Database className="w-6 h-6 text-[#00ff41]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#00ff41]">Docker Machines</h3>
                      <Badge variant="info" className="mt-1">150+ Available</Badge>
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Access a wide variety of Docker-based cybersecurity
                    challenges with different difficulty levels and scenarios.
                  </p>
                </GlowCard>

                <HolographicCard>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-[#00ff41]/20 rounded-lg flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-[#00ff41]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#00ff41]">Reviews & Ratings</h3>
                      <Badge variant="success" className="mt-1">5,000+ Reviews</Badge>
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Read reviews from other hackers and share your own
                    experiences with different machines and challenges.
                  </p>
                </HolographicCard>

                <GlowCard intensity="high" glowColor="#ff6b6b">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mr-4">
                      <Zap className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-400">Personal Lists</h3>
                      <Badge variant="warning" className="mt-1">94% Success Rate</Badge>
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    Save machines to your favorites and create todo lists to
                    track your learning progress and achievements.
                  </p>
                </GlowCard>
              </CyberGrid>
            </Container>
          </section>

          {/* Sección de terminal simulada */}
          <section className="py-20 relative overflow-hidden">
            <Container className="relative z-10">
              <div className="max-w-4xl mx-auto">
                <TerminalWindow title="hacker@tasave-lab:~$" showControls>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="text-[#00ff41] mr-2">$</span>
                      <GlitchText trigger="auto" intensity="low">
                        sudo ./initialize_cybersecurity_lab.sh
                      </GlitchText>
                    </div>
                    <div className="text-gray-400">
                      [INFO] Loading Docker containers...
                    </div>
                    <div className="text-green-400">
                      [SUCCESS] 150+ machines ready for deployment
                    </div>
                    <div className="text-blue-400">
                      [INFO] Community features initialized
                    </div>
                    <div className="text-yellow-400">
                      [WARNING] Remember to practice ethically
                    </div>
                    <div className="flex">
                      <span className="text-[#00ff41] mr-2">$</span>
                      <span>echo &quot;Welcome to TaSave - Your Cybersecurity Playground&quot;</span>
                    </div>
                    <div className="text-[#00ff41] font-bold">
                      Welcome to TaSave - Your Cybersecurity Playground
                    </div>
                  </div>
                </TerminalWindow>
              </div>
            </Container>
          </section>
        </div>
      </AnimatedPage>
    </>
  );
}