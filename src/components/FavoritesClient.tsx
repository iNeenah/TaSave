"use client";

import { useState, useMemo } from "react";
import MachineCard from "@/components/MachineCard";
import { HackerButton, Badge, GlowCard, TerminalWindow, LetterGlitchBackground } from "@/components/ui";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search,
  Heart
} from "lucide-react";
import Link from "next/link";

interface Machine {
  id: number;
  name: string;
  description: string | null;
  difficulty: "very_easy" | "easy" | "medium" | "hard";
  image: string | null;
  downloadLink: string | null;
  creationDate: string | null;
  author: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface MachineWithData {
  machine: Machine;
  isFavorited: boolean;
  isInTodo: boolean;
  reviewCount: number;
  averageRating: number;
}

interface FavoritesClientProps {
  favoriteMachines: MachineWithData[];
}

const MACHINES_PER_PAGE = 12;

export default function FavoritesClient({ favoriteMachines }: FavoritesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter machines based on search
  const filteredMachines = useMemo(() => {
    return favoriteMachines.filter((item) => {
      const machine = item.machine;
      
      // Search filter
      if (searchTerm && !machine.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !(machine.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)) {
        return false;
      }
      
      return true;
    });
  }, [favoriteMachines, searchTerm]);

  // Paginate filtered machines
  const totalPages = Math.ceil(filteredMachines.length / MACHINES_PER_PAGE);
  const startIndex = (currentPage - 1) * MACHINES_PER_PAGE;
  const paginatedMachines = filteredMachines.slice(startIndex, startIndex + MACHINES_PER_PAGE);

  return (
    <div className="min-h-screen bg-black relative">
      {/* LetterGlitch Background */}
      <LetterGlitchBackground intensity="low" blur={true} />
      
      <div className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00ff41] font-mono mb-2">
            &gt; Your Favorites
          </h1>
          <p className="text-green-400 font-mono">
            Machines you&apos;ve marked as favorites
            <span className="ml-2">
              <Badge variant="success">{filteredMachines.length} favorites</Badge>
            </span>
          </p>
        </div>

        {favoriteMachines.length === 0 ? (
          <div className="text-center py-12">
            <TerminalWindow title="favorites@tasave:~$" showControls>
              <div className="space-y-2">
                <div className="text-green-400">
                  <Heart className="w-8 h-8 mx-auto mb-4" />
                </div>
                <div className="text-yellow-400">
                  [INFO] No favorites found
                </div>
                <div className="text-gray-400">
                  Start exploring machines and add them to your favorites
                </div>
                <div className="flex">
                  <span className="text-[#00ff41] mr-2">$</span>
                  <span>cd /dashboard && explore</span>
                </div>
              </div>
            </TerminalWindow>
            <Link href="/dashboard" className="mt-6 inline-block">
              <HackerButton variant="default" size="lg">
                Browse Machines
              </HackerButton>
            </Link>
          </div>
        ) : (
          <>
            {/* Search */}
            {favoriteMachines.length > 6 && (
              <GlowCard intensity="low" className="mb-8">
                <div className="p-6">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search favorites..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#00ff41] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </GlowCard>
            )}

            {/* Results */}
            {paginatedMachines.length === 0 ? (
              <div className="text-center py-12">
                <TerminalWindow title="search@favorites:~$" showControls>
                  <div className="space-y-2">
                    <div className="text-yellow-400">
                      [WARNING] No favorites match your search
                    </div>
                    <div className="text-gray-400">
                      Try a different search term
                    </div>
                  </div>
                </TerminalWindow>
              </div>
            ) : (
              <>
                {/* Machines Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                  {paginatedMachines.map(({
                    machine,
                    isFavorited,
                    isInTodo,
                    reviewCount,
                    averageRating,
                  }) => (
                    <MachineCard
                      key={machine.id}
                      machine={machine}
                      isFavorited={isFavorited}
                      isInTodo={isInTodo}
                      userReviewCount={reviewCount}
                      averageRating={averageRating}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4">
                    <HackerButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </HackerButton>

                    <div className="flex space-x-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <HackerButton
                          key={page}
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </HackerButton>
                      ))}
                    </div>

                    <HackerButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </HackerButton>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-gray-400 font-mono">
                    Showing {startIndex + 1}-{Math.min(startIndex + MACHINES_PER_PAGE, filteredMachines.length)} of {filteredMachines.length} favorites
                    {filteredMachines.length !== favoriteMachines.length && (
                      <span className="ml-2">
                        (filtered from {favoriteMachines.length} total)
                      </span>
                    )}
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}