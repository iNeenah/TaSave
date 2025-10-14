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
  AlertTriangle,
  Clock,
  Star,
  TrendingUp,
  MessageSquare,
  SortAsc
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
  canUploadMachines?: boolean;
}

const MACHINES_PER_PAGE = 12;

export default function DashboardClient({ machinesWithData, username, canUploadMachines = false }: DashboardClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("newest");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and sort machines based on selected filters
  const filteredMachines = useMemo(() => {
    const filtered = machinesWithData.filter((item) => {
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

    // Sort machines based on selected sort option
    switch (selectedSort) {
      case "newest":
        filtered.sort((a, b) => new Date(b.machine.createdAt).getTime() - new Date(a.machine.createdAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.machine.createdAt).getTime() - new Date(b.machine.createdAt).getTime());
        break;
      case "top_rated":
        filtered.sort((a, b) => {
          // Sort by average rating (descending), then by review count (descending)
          if (b.averageRating !== a.averageRating) {
            return b.averageRating - a.averageRating;
          }
          return b.reviewCount - a.reviewCount;
        });
        break;
      case "most_reviewed":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.machine.name.localeCompare(b.machine.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [machinesWithData, searchTerm, selectedDifficulty, selectedSort]);

  // Paginate filtered machines
  const totalPages = Math.ceil(filteredMachines.length / MACHINES_PER_PAGE);
  const startIndex = (currentPage - 1) * MACHINES_PER_PAGE;
  const paginatedMachines = filteredMachines.slice(startIndex, startIndex + MACHINES_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    if (filterType === "difficulty") {
      setSelectedDifficulty(value);
    } else if (filterType === "sort") {
      setSelectedSort(value);
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#00ff41] font-mono mb-2">
                &gt; Dashboard
              </h1>
              <div className="text-green-400 font-mono">
                Welcome back, <span className="text-green-300">{username}</span>!
                <span className="ml-2">
                  <Badge variant="success">{filteredMachines.length} machines found</Badge>
                </span>
                {filteredMachines.length !== machinesWithData.length && (
                  <span className="ml-2">
                    <Badge variant="outline">of {machinesWithData.length} total</Badge>
                  </span>
                )}
              </div>
              {/* Active Filters Indicator */}
              {(selectedDifficulty !== "all" || selectedSort !== "newest" || searchTerm) && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs text-gray-400 font-mono">Active filters:</span>
                  {selectedDifficulty !== "all" && (
                    <Badge variant="outline" className="text-xs">
                      Difficulty: {selectedDifficulty === "very_easy" ? "Very Easy" : selectedDifficulty}
                    </Badge>
                  )}
                  {selectedSort !== "newest" && (
                    <Badge variant="outline" className="text-xs">
                      Sort: {selectedSort === "top_rated" ? "Top Rated" : 
                             selectedSort === "most_reviewed" ? "Most Reviewed" :
                             selectedSort === "alphabetical" ? "A-Z" :
                             selectedSort === "oldest" ? "Oldest" : selectedSort}
                    </Badge>
                  )}
                  {searchTerm && (
                    <Badge variant="outline" className="text-xs">
                      Search: "{searchTerm}"
                    </Badge>
                  )}
                  <HackerButton
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDifficulty("all");
                      setSelectedSort("newest");
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="text-xs h-6 px-2"
                  >
                    Clear all
                  </HackerButton>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {canUploadMachines && (
                <HackerButton
                  onClick={() => window.location.href = '/upload'}
                  className="whitespace-nowrap"
                >
                  <span className="mr-2">+</span>
                  Upload Machine
                </HackerButton>
              )}
            </div>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <HackerButton
            variant={selectedSort === "newest" && selectedDifficulty === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setSelectedSort("newest");
              setSelectedDifficulty("all");
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Recently Added
          </HackerButton>

          <HackerButton
            variant={selectedSort === "top_rated" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setSelectedSort("top_rated");
              setSelectedDifficulty("all");
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Top Rated
          </HackerButton>

          <HackerButton
            variant={selectedSort === "most_reviewed" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setSelectedSort("most_reviewed");
              setSelectedDifficulty("all");
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Most Reviewed
          </HackerButton>

          <HackerButton
            variant={selectedDifficulty === "easy" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setSelectedDifficulty("easy");
              setSelectedSort("newest");
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            Beginner Friendly
          </HackerButton>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400 font-mono">Recently Added</span>
            </div>
            <div className="text-xl font-bold text-white">
              {machinesWithData.filter(m => {
                const daysSinceCreated = (Date.now() - new Date(m.machine.createdAt).getTime()) / (1000 * 60 * 60 * 24);
                return daysSinceCreated <= 7;
              }).length}
            </div>
            <div className="text-xs text-gray-500">Last 7 days</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400 font-mono">Top Rated</span>
            </div>
            <div className="text-xl font-bold text-white">
              {machinesWithData.filter(m => m.averageRating >= 4).length}
            </div>
            <div className="text-xs text-gray-500">4+ stars</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400 font-mono">Most Reviewed</span>
            </div>
            <div className="text-xl font-bold text-white">
              {Math.max(...machinesWithData.map(m => m.reviewCount), 0)}
            </div>
            <div className="text-xs text-gray-500">Max reviews</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400 font-mono">Your Activity</span>
            </div>
            <div className="text-xl font-bold text-white">
              {machinesWithData.filter(m => m.isFavorited || m.isInTodo).length}
            </div>
            <div className="text-xs text-gray-500">Favorites + Todos</div>
          </div>
        </div>

        {/* Filters Section */}
        <GlowCard intensity="low" className="mb-8">
          <div className="p-6">
            <div className="flex flex-col gap-4">
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

              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
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

                {/* Sort Filter */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-400 font-mono mr-2">Sort by:</span>
                  {[
                    { key: "newest", label: "Recently Added", icon: <Clock className="w-4 h-4" /> },
                    { key: "top_rated", label: "Top Rated", icon: <Star className="w-4 h-4" /> },
                    { key: "most_reviewed", label: "Most Reviewed", icon: <MessageSquare className="w-4 h-4" /> },
                    { key: "alphabetical", label: "A-Z", icon: <SortAsc className="w-4 h-4" /> },
                    { key: "oldest", label: "Oldest", icon: <TrendingUp className="w-4 h-4" /> }
                  ].map((sort) => (
                    <HackerButton
                      key={sort.key}
                      variant={selectedSort === sort.key ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleFilterChange("sort", sort.key)}
                      className={selectedSort === sort.key ? "" : "hover:text-[#00ff41]"}
                    >
                      {sort.icon}
                      <span className="ml-1">{sort.label}</span>
                    </HackerButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </GlowCard>

        {/* Filter Results Info */}
        {filteredMachines.length > 0 && (
          <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-300">
                  Showing <span className="text-green-400 font-semibold">{filteredMachines.length}</span> machines
                  {selectedSort === "newest" && " sorted by newest first"}
                  {selectedSort === "top_rated" && " sorted by highest rating"}
                  {selectedSort === "most_reviewed" && " sorted by most reviews"}
                  {selectedSort === "alphabetical" && " sorted alphabetically"}
                  {selectedSort === "oldest" && " sorted by oldest first"}
                </div>
              </div>
              {selectedSort === "top_rated" && (
                <div className="text-xs text-yellow-400 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Avg rating: {(filteredMachines.reduce((sum, m) => sum + m.averageRating, 0) / filteredMachines.length).toFixed(1)}
                </div>
              )}
            </div>
          </div>
        )}

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
                  <span>echo &quot;Keep exploring, hacker!&quot;</span>
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
              <div className="text-sm text-gray-400 font-mono">
                Showing {startIndex + 1}-{Math.min(startIndex + MACHINES_PER_PAGE, filteredMachines.length)} of {filteredMachines.length} machines
                {filteredMachines.length !== machinesWithData.length && (
                  <span className="ml-2">
                    (filtered from {machinesWithData.length} total)
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}