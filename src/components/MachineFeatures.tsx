import { Machine } from "@/db/schema";
import DifficultyBadge from "./ui/DifficultyBadge";

interface MachineFeaturesProps {
  machine: Machine;
}

export default function MachineFeatures({ machine }: MachineFeaturesProps) {

  return (
    <div className="bg-gradient-to-b from-white/8 to-white/4 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {/* Sección 1: Dificultad */}
        <div className="p-6 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Difficulty Level
            </span>
          </div>
          <DifficultyBadge difficulty={machine.difficulty} size="lg" />
        </div>

        {/* Sección 2: Metadatos */}
        <div className="p-6 space-y-4">
          <div className="text-center mb-4">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Details
            </span>
          </div>
          
          {machine.author && (
            <div className="flex items-center space-x-3">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="text-xs text-gray-500">Author</p>
                <p className="text-sm text-white font-medium">{machine.author}</p>
              </div>
            </div>
          )}
          
          {machine.creationDate && (
            <div className="flex items-center space-x-3">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm text-white font-medium">{machine.creationDate}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sección 3: Acción Principal */}
        <div className="p-6 flex flex-col items-center justify-center">
          <div className="text-center mb-4">
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">
              Action
            </span>
          </div>
          
          {machine.downloadLink ? (
            <a
              href={machine.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Machine
            </a>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">No download available</p>
              <div className="inline-flex items-center px-6 py-3 bg-gray-600 text-gray-400 font-semibold rounded-lg cursor-not-allowed">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Machine
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}