import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-obsidian selection:bg-neon-cyan/30">
      <Navbar />
      
      {/* Temporary Hero Section to test UI */}
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <div className="space-y-6 max-w-3xl">
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white">
            Code. Compete. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-blue-600">
              Conquer.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light">
            The official programming hub of our campus. 
            Join 500+ developers building the future.
          </p>
          
          <div className="flex gap-4 justify-center pt-4">
            <button className="px-8 py-3 rounded-lg bg-neon-cyan text-obsidian font-bold hover:shadow-[0_0_20px_rgba(102,252,241,0.4)] transition-all">
              Start Coding
            </button>
            <button className="px-8 py-3 rounded-lg border border-white/20 hover:bg-white/5 transition-all text-white">
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}