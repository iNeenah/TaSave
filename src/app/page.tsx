import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import BackgroundVideo from "@/components/ui/BackgroundVideo";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="bg-black min-h-screen text-green-500">
      {/* Hero Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <BackgroundVideo src="/videos/matrix-bg.mp4" opacity={0.08} />
        <Container className="relative z-10">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-5xl lg:text-7xl font-bold mb-4">
                <span className="block text-green-500 terminal-text">
                  &gt; TaSave_
                </span>
              </h1>
              <div className="text-lg lg:text-xl text-gray-400 mb-2">
                <span className="text-green-500">root@tasave:~$</span> initializing cybersecurity_lab...
              </div>
              <div className="text-lg lg:text-xl text-gray-400">
                <span className="text-green-500">[OK]</span> Docker machines loaded successfully
              </div>
            </div>
            
            <p className="mt-6 max-w-3xl mx-auto text-lg lg:text-xl text-gray-400 leading-relaxed">
              Practice cybersecurity with Docker machines. Learn, explore, and
              master various security challenges in a <span className="text-green-500">safe environment</span>.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
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
            <h2 className="text-3xl lg:text-4xl font-bold text-green-500 mb-4">
              &gt; System Features
            </h2>
            <p className="text-lg text-gray-400">
              Everything you need to practice cybersecurity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
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

            <Card>
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

            <Card>
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
          </div>
        </Container>
      </section>

      {/* Terminal Section */}
      <section className="py-20 relative overflow-hidden">
        <BackgroundVideo src="/videos/terminal-bg.mp4" opacity={0.05} overlay={false} />
        <Container className="relative z-10">
          <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-lg p-8 shadow-2xl">
            <div className="flex items-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-4 text-gray-400 text-sm">terminal</div>
            </div>
            <div className="space-y-2 text-sm font-mono">
              <div><span className="text-green-500">user@tasave:~$</span> <span className="text-white">ls -la /cybersecurity/challenges</span></div>
              <div className="text-gray-400">total 42</div>
              <div className="text-gray-400">drwxr-xr-x 8 root root 4096 Dec 21 2024 .</div>
              <div className="text-gray-400">drwxr-xr-x 3 root root 4096 Dec 21 2024 ..</div>
              <div className="text-green-500">-rwxr-xr-x 1 root root 2048 Dec 21 2024 web_exploitation</div>
              <div className="text-green-500">-rwxr-xr-x 1 root root 1024 Dec 21 2024 privilege_escalation</div>
              <div className="text-green-500">-rwxr-xr-x 1 root root 3072 Dec 21 2024 network_analysis</div>
              <div><span className="text-green-500">user@tasave:~$</span> <span className="text-white">./start_challenge.sh</span></div>
              <div className="text-green-500">[+] Challenge environment initialized</div>
              <div className="text-green-500">[+] Ready to hack!</div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}