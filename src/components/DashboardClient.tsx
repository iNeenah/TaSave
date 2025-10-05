"use client";

import { useState, useMemo } from "react";
import MachineCard from "@/components/MachineCard";
import { HackerButton, Badge, GlowCard, TerminalWindow, LetterGlitchBackground } from "@/components/ui";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  Zap,
  Shield,
  AlertTriangle
} from "lucide-react";

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

interface DashboardClientProps {
  machinesWithData: MachineWithData[];
  username: string;
}

const MACHINES_PER_PAGE = 12;

export default function DashboardClient({ machinesWithData, username }: DashboardClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  // Removed OS filter since it's not in the database schema
  const [searchTerm, setSearchTerm] = useState("");

  // Filter machines based on selected filters
  const filteredMachines = useMemo(() => {
    return machinesWithData.filter((item) => {
      const machine = item.machine;

      // Search filter
      if (searchTerm && !machine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(machine.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== "all" && machine.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [machinesWithData, searchTerm, selectedDifficulty]);

  // Paginate filtered machines
  const totalPages = Math.ceil(filteredMachines.length / MACHINES_PER_PAGE);
  const startIndex = (currentPage - 1) * MACHINES_PER_PAGE;
  const paginatedMachines = filteredMachines.slice(startIndex, startIndex + MACHINES_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    if (filterType === "difficulty") {
      setSelectedDifficulty(value);
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return <Shield className="w-4 h-4" />;
      case "medium": return <Zap className="w-4 h-4" />;
      case "hard": return <AlertTriangle className="w-4 h-4" />;
      default: return <Filter className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "very_easy": return "text-blue-400";
      case "easy": return "text-green-400";
      case "medium": return "text-yellow-400";
      case "hard": return "text-red-400";
      default: return "text-[#00ff41]";
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* LetterGlitch Background */}
      <LetterGlitchBackground intensity="low" blur={true} />

      <div className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#00ff41] font-mono mb-2">
            &gt; Dashboard
          </h1>
          <p className="text-green-400 font-mono">
            Welcome back, <span className="text-green-300">{username}</span>!
            <span className="ml-2">
              <Badge variant="success">{filteredMachines.length} machines found</Badge>
            </span>
          </p>
        </div>

        {/* Filters Section */}
        <GlowCard intensity="low" className="mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search machines..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-[#00ff41] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-400 font-mono mr-2">Difficulty:</span>
                {["all", "very_easy", "easy", "medium", "hard"].map((difficulty) => (
                  <HackerButton
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleFilterChange("difficulty", difficulty)}
                    className={selectedDifficulty === difficulty ? "" : "hover:text-[#00ff41]"}
                  >
                    {getDifficultyIcon(difficulty)}
                    <span className={`ml-1 capitalize ${getDifficultyColor(difficulty)}`}>
                      {difficulty === "very_easy" ? "Very Easy" : difficulty}
                    </span>
                  </HackerButton>
                ))}
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Results */}
        {paginatedMachines.length === 0 ? (
          <div className="text-center py-12">
            <TerminalWindow title="system@tasave:~$" showControls>
              <div className="space-y-2">
                <div className="text-yellow-400">
                  [WARNING] No machines found matching your criteria
                </div>
                <div className="text-gray-400">
                  Try adjusting your filters or search terms
                </div>
                <div className="flex">
                  <span className="text-[#00ff41] mr-2">$</span>
                  <span>echo "Keep exploring, hacker!"</span>
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
                Showing {startIndex + 1}-{Math.min(startIndex + MACHINES_PER_PAGE, filteredMachines.length)} of {filteredMachines.length} machines
                {filteredMachines.length !== machinesWithData.length && (
                  <span className="ml-2">
                    (filtered from {machinesWithData.length} total)
                  </span>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}