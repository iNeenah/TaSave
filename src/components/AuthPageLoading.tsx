import AtmosphericVideo from "@/components/ui/AtmosphericVideo";

export default function AuthPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <AtmosphericVideo src="/videos/1.mp4" />
      
      {/* Terminal-style background grid */}
      <div className="absolute inset-0 bg-black/50">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-green-900/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* Loading content */}
      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-green-500 terminal-text">
            &gt; Initializing Terminal
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Loading authentication system...
          </p>
        </div>

        {/* Loading animation */}
        <div className="bg-gradient-to-b from-white/8 to-white/4 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
            
            <div className="space-y-2">
              <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            <div className="h-12 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Terminal loading indicator */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-green-500 font-mono text-sm">
            <div className="animate-spin w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full"></div>
            <span>Loading authentication module...</span>
          </div>
        </div>
      </div>

      {/* Terminal-style decorations */}
      <div className="absolute top-4 left-4 text-green-500/30 font-mono text-xs">
        <div>SYSTEM: TaSave Authentication Terminal</div>
        <div>STATUS: INITIALIZING</div>
        <div>SECURITY: ENCRYPTED</div>
      </div>

      <div className="absolute bottom-4 right-4 text-green-500/30 font-mono text-xs">
        <div>CONNECTION: ESTABLISHING</div>
        <div>PROTOCOL: HTTPS</div>
        <div>SESSION: PENDING</div>
      </div>
    </div>
  );
}