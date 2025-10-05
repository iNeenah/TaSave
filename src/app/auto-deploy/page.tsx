import { getCurrentUser } from "@/lib/auth";
import {
  GlowCard,
  HolographicCard,
  CyberGrid,
  MatrixRain,
  GlitchText,
  Badge,
  TerminalWindow,
  ScrollFloat
} from "@/components/ui";
import Container from "@/components/ui/Container";
import AnimatedPage from "@/components/AnimatedPage";
import SmoothScrolling from "@/components/SmoothScrolling";
import { 
  Play, 
  Square, 
  AlertTriangle, 
  CheckCircle,
  Box,
  Network,
  Trash2
} from "lucide-react";

export default async function AutoDeployPage() {

  return (
    <>
      <SmoothScrolling />
      <MatrixRain intensity="low" />
      <AnimatedPage>
        <div className="bg-black min-h-screen text-green-500 relative z-10">
          {/* Hero Section */}
          <section className="py-20 lg:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black"></div>
            <Container className="relative z-10">
              <div className="text-center mb-16">
                <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                  <span className="text-[#00ff41] terminal-text">
                    &gt; <GlitchText trigger="auto" intensity="medium">Auto Deploy</GlitchText>
                  </span>
                </h1>
                <HolographicCard className="max-w-4xl mx-auto">
                  <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                    Complete guide to install Docker and run TaSave machines
                  </p>
                </HolographicCard>
              </div>
            </Container>
          </section>

          {/* Docker Installation Section */}
          <section className="py-16 bg-gray-950/50 relative overflow-hidden backdrop-blur-sm">
            <Container className="relative z-10">
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Box className="w-8 h-8 mr-4 text-[#00ff41]" />
                  <ScrollFloat 
                    containerClassName="mb-0"
                    textClassName="text-3xl lg:text-4xl font-bold text-[#00ff41]"
                    animationDuration={1.2}
                    stagger={0.05}
                  >
                    Docker Installation
                  </ScrollFloat>
                </div>
                <p className="text-lg text-gray-400 mb-8">
                  For TaSave machines to work properly, Docker must be installed on your system:
                </p>
              </div>

              <GlowCard intensity="high" className="mb-8">
                <TerminalWindow title="root@system:~$" showControls>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="text-[#00ff41] mr-2">$</span>
                      <span className="text-white">sudo apt install docker.io</span>
                    </div>
                    <div className="text-green-400">
                      [INFO] Installing Docker Engine...
                    </div>
                    <div className="text-green-400">
                      [SUCCESS] Docker installed successfully
                    </div>
                  </div>
                </TerminalWindow>
              </GlowCard>
            </Container>
          </section>

          {/* How to Execute Machines Section */}
          <section className="py-16">
            <Container className="relative z-10">
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Play className="w-8 h-8 mr-4 text-[#00ff41]" />
                  <ScrollFloat 
                    containerClassName="mb-0"
                    textClassName="text-3xl lg:text-4xl font-bold text-[#00ff41]"
                    animationDuration={1.2}
                    stagger={0.05}
                  >
                    How to Execute Machines
                  </ScrollFloat>
                </div>
                <p className="text-lg text-gray-400 mb-8">
                  Once we have downloaded a machine in .tar format, we will see that there is a script called 
                  <Badge variant="info" className="mx-2">auto_deploy.sh</Badge>
                  along with each machine, so we only have to execute that script to deploy or delete the laboratory.
                </p>
              </div>

              <HolographicCard className="mb-8">
                <TerminalWindow title="hacker@tasave:~/machines$" showControls>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="text-[#00ff41] mr-2">$</span>
                      <span className="text-white">sudo bash auto_deploy.sh laboratory.tar</span>
                    </div>
                    <div className="text-blue-400">
                      [INFO] Loading machine from laboratory.tar...
                    </div>
                    <div className="text-yellow-400">
                      [DEPLOY] Starting Docker containers...
                    </div>
                    <div className="text-green-400">
                      [SUCCESS] Machine deployed successfully
                    </div>
                    <div className="text-gray-400">
                      © Copyright TaSave
                    </div>
                  </div>
                </TerminalWindow>
              </HolographicCard>
            </Container>
          </section>

          {/* Pivoting Machines Section */}
          <section className="py-16 bg-gray-950/50 relative overflow-hidden backdrop-blur-sm">
            <Container className="relative z-10">
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Network className="w-8 h-8 mr-4 text-[#00ff41]" />
                  <ScrollFloat 
                    containerClassName="mb-0"
                    textClassName="text-3xl lg:text-4xl font-bold text-[#00ff41]"
                    animationDuration={1.2}
                    stagger={0.05}
                  >
                    Pivoting Machines
                  </ScrollFloat>
                </div>
                <p className="text-lg text-gray-400 mb-8">
                  Once we have downloaded and decompressed a pivoting machine, we will see several .tar files that will be 
                  labeled in order <Badge variant="warning">machine1.tar</Badge>, <Badge variant="warning">machine2.tar</Badge>, 
                  <Badge variant="warning">machine3.tar</Badge> and their respective script <Badge variant="info">auto_deploy.sh</Badge>, 
                  which will be responsible for automatically mounting the pivoting network.
                </p>
              </div>

              <GlowCard intensity="medium" glowColor="#ff6b6b" className="mb-8">
                <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Start the machine:
                </h3>
                <TerminalWindow title="hacker@tasave:~/pivoting$" showControls>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="text-[#00ff41] mr-2">$</span>
                      <span className="text-white">sudo bash auto_deploy.sh machine1.tar machine2.tar machine3.tar machine4.tar</span>
                    </div>
                    <div className="text-blue-400">
                      [INFO] Setting up pivoting network...
                    </div>
                    <div className="text-yellow-400">
                      [NETWORK] Creating virtual network bridges...
                    </div>
                    <div className="text-green-400">
                      [SUCCESS] Pivoting lab deployed successfully
                    </div>
                    <div className="text-gray-400">
                      © Copyright TaSave
                    </div>
                  </div>
                </TerminalWindow>
              </GlowCard>
            </Container>
          </section>

          {/* How to Remove Machines Section */}
          <section className="py-16">
            <Container className="relative z-10">
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Trash2 className="w-8 h-8 mr-4 text-[#00ff41]" />
                  <ScrollFloat 
                    containerClassName="mb-0"
                    textClassName="text-3xl lg:text-4xl font-bold text-[#00ff41]"
                    animationDuration={1.2}
                    stagger={0.05}
                  >
                    How to Remove Machines
                  </ScrollFloat>
                </div>
                <p className="text-lg text-gray-400 mb-8">
                  Once we have finished with the laboratory, we simply press 
                  <Badge variant="warning" className="mx-2">Control + C</Badge>
                  and the entire laboratory will be removed from the system.
                </p>
              </div>

              <CyberGrid columns={2} gap={8}>
                <HolographicCard>
                  <h3 className="text-xl font-bold text-[#00ff41] mb-4 flex items-center">
                    <Square className="w-5 h-5 mr-2" />
                    Normal Machines
                  </h3>
                  <TerminalWindow title="hacker@tasave:~$" showControls>
                    <div className="space-y-2">
                      <div className="text-yellow-400">
                        [INFO] Press Ctrl+C to stop...
                      </div>
                      <div className="flex">
                        <span className="text-red-400 mr-2">^C</span>
                        <span className="text-gray-400">Interrupt signal received</span>
                      </div>
                      <div className="text-green-400">
                        [SUCCESS] Lab removed successfully
                      </div>
                      <div className="text-gray-400">
                        © Copyright TaSave
                      </div>
                    </div>
                  </TerminalWindow>
                </HolographicCard>

                <GlowCard intensity="medium" glowColor="#ff6b6b">
                  <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Pivoting Machines
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      In the case of a pivoting machine, it will ask us the following:
                    </p>
                    <div className="bg-gray-900 p-4 rounded border border-red-500/30">
                      <p className="text-yellow-400 mb-2">
                        Do you want to remove all Docker images?
                      </p>
                      <p className="text-sm text-gray-400">
                        <span className="text-green-400">Yes:</span> If we don't mind losing other Docker images
                      </p>
                      <p className="text-sm text-gray-400">
                        <span className="text-red-400">No:</span> If we have images we want to keep
                      </p>
                    </div>
                  </div>
                </GlowCard>
              </CyberGrid>
            </Container>
          </section>

          {/* Troubleshooting Section */}
          <section className="py-16 bg-gray-950/50 relative overflow-hidden backdrop-blur-sm">
            <Container className="relative z-10">
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-8 h-8 mr-4 text-[#00ff41]" />
                  <ScrollFloat 
                    containerClassName="mb-0"
                    textClassName="text-3xl lg:text-4xl font-bold text-[#00ff41]"
                    animationDuration={1.2}
                    stagger={0.05}
                  >
                    Error Solutions
                  </ScrollFloat>
                </div>
                <p className="text-lg text-gray-400 mb-8">
                  It is possible that in some specific cases you may experience some error. 
                  That is why we provide a series of commands to solve most errors or problems:
                </p>
              </div>

              <div className="space-y-6">
                <GlowCard intensity="high" glowColor="#fbbf24">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">
                    Restart Docker service
                  </h3>
                  <TerminalWindow title="root@system:~$" showControls>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="text-[#00ff41] mr-2">$</span>
                        <span className="text-white">sudo systemctl restart docker</span>
                      </div>
                      <div className="text-green-400">
                        [SUCCESS] Docker service restarted
                      </div>
                    </div>
                  </TerminalWindow>
                </GlowCard>

                <HolographicCard>
                  <h3 className="text-xl font-bold text-blue-400 mb-4">
                    Stop all containers
                  </h3>
                  <TerminalWindow title="root@system:~$" showControls>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="text-[#00ff41] mr-2">$</span>
                        <span className="text-white">sudo docker stop $(docker ps -q)</span>
                      </div>
                      <div className="text-blue-400">
                        [INFO] Stopping all running containers...
                      </div>
                      <div className="text-green-400">
                        [SUCCESS] All containers stopped
                      </div>
                    </div>
                  </TerminalWindow>
                </HolographicCard>

                <GlowCard intensity="medium" glowColor="#ef4444">
                  <h3 className="text-xl font-bold text-red-400 mb-4">
                    Clean unused containers
                  </h3>
                  <TerminalWindow title="root@system:~$" showControls>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="text-[#00ff41] mr-2">$</span>
                        <span className="text-white">sudo docker container prune --force</span>
                      </div>
                      <div className="text-yellow-400">
                        [WARNING] Removing unused containers...
                      </div>
                      <div className="text-green-400">
                        [SUCCESS] Cleanup completed
                      </div>
                    </div>
                  </TerminalWindow>
                </GlowCard>
              </div>
            </Container>
          </section>

          {/* Footer Section */}
          <section className="py-12 border-t border-[#00ff41]/30">
            <Container>
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  © Copyright TaSave - Cybersecurity Training Platform
                </div>
                <Badge variant="success">System Ready</Badge>
              </div>
            </Container>
          </section>
        </div>
      </AnimatedPage>
    </>
  );
}