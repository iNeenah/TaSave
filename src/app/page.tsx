import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import InteractiveTooltip from "@/components/ui/InteractiveTooltip";
import AnimatedPage from "@/components/AnimatedPage";
import Preloader from "@/components/Preloader";
import SmoothScrolling from "@/components/SmoothScrolling";
import ScrambleTitle from "@/components/ui/ScrambleTitle";
import TerminalTypewriter from "@/components/ui/TerminalTypewriter";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <>
      <Preloader />
      <SmoothScrolling />
      <AnimatedPage>
        <div className="bg-black min-h-screen text-green-500">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <BackgroundVideo src="/videos/matrix-bg.mp4" opacity={0.08} />
        <Container className="relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="hero-title text-5xl lg:text-7xl font-bold mb-4">
                <span className="block text-green-500 terminal-text">
                  &gt; <ScrambleTitle text="TaSave" />
                </span>
              </h1>
              <div className="hero-subtitle text-lg lg:text-xl text-gray-400 mb-2">
                <span className="text-green-500">root@tasave:~$</span> initializing cybersecurity_lab...
              </div>
              <div className="hero-subtitle text-lg lg:text-xl text-gray-400">
                <span className="text-green-500">[OK]</span> Docker machines loaded successfully
              </div>
            </div>
            
            <p className="hero-description mt-6 max-w-3xl mx-auto text-lg lg:text-xl text-gray-400 leading-relaxed">
              Practice cybersecurity with Docker machines. Learn, explore, and
              master various security challenges in a <span className="text-green-500">safe environment</span>.
            </p>
            
            <div className="hero-buttons mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto">
                    &gt; Access Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      &gt; Initialize Session
                    </Button>
                  </Link>
                  <Link href="/signin">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      &gt; Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-950 relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 animate-pulse" />
          <div className="particles" />
        </div>
        <Container className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="features-title text-3xl lg:text-4xl font-bold text-green-500 mb-4">
              &gt; System Features
            </h2>
            <p className="features-subtitle text-lg text-gray-400">
              Everything you need to practice cybersecurity
            </p>
          </div>

          <div className="features-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InteractiveTooltip
              content={{
                title: "DOCKER ENVIRONMENTS",
                stat: "150+ Machines",
                icon: "🐳"
              }}
            >
              <Card className="feature-card">
                <CardHeader>
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-black text-2xl font-bold">
                      🐳
                    </div>
                  </div>
                  <CardTitle>Docker Machines</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Access a wide variety of Docker-based cybersecurity
                    challenges with different difficulty levels and scenarios.
                  </p>
                </CardContent>
              </Card>
            </InteractiveTooltip>

            <InteractiveTooltip
              content={{
                title: "COMMUNITY FEEDBACK",
                stat: "5,000+ Reviews",
                icon: "⭐"
              }}
            >
              <Card className="feature-card">
                <CardHeader>
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-black text-2xl font-bold">
                      ⭐
                    </div>
                  </div>
                  <CardTitle>Reviews &amp; Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Read reviews from other hackers and share your own
                    experiences with different machines and challenges.
                  </p>
                </CardContent>
              </Card>
            </InteractiveTooltip>

            <InteractiveTooltip
              content={{
                title: "PROGRESS TRACKING",
                stat: "94% Success Rate",
                icon: "📝"
              }}
            >
              <Card className="feature-card">
                <CardHeader>
                  <div className="mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-black text-2xl font-bold">
                      📝
                    </div>
                  </div>
                  <CardTitle>Personal Lists</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Save machines to your favorites and create todo lists to
                    track your learning progress and achievements.
                  </p>
                </CardContent>
              </Card>
            </InteractiveTooltip>
          </div>
        </Container>
      </section>

      {/* Terminal Section */}
      <section className="py-20 relative overflow-hidden">
        <BackgroundVideo src="/videos/terminal-bg.mp4" opacity={0.05} overlay={false} />
        <Container className="relative z-10">
          <TerminalTypewriter />
        </Container>
      </section>
        </div>
      </AnimatedPage>
    </>
  );
}