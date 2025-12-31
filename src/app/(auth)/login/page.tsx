"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Github, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

// 1. Define a type for our star to keep TypeScript happy
type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
};

const Starfield = () => {
  // 2. Initialize with an EMPTY array. 
  // This ensures the Server renders exactly what the Client renders initially (nothing).
  const [stars, setStars] = useState<Star[]>([]);

  // 3. Use useEffect to generate positions ONLY on the client side
  useEffect(() => {
    const generatedStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 10 + 10,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full opacity-20"
          // We set initial positions via style to avoid layout shifts
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            y: [0, -100], // Move up
            opacity: [0.2, 0.5, 0.2], // Twinkle
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center relative overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-slate-deep)_0%,_var(--color-obsidian)_100%)]" />
      
      {/* The Starfield will now load safely */}
      <Starfield />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-slate/50 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_-12px_rgba(102,252,241,0.2)]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-neon-cyan/10 mb-4 ring-1 ring-neon-cyan/50">
            <Terminal className="w-8 h-8 text-neon-cyan" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            Identify Yourself
          </h1>
          <p className="text-gray-400 text-sm">
            Access the Knuth Programming Hub mainframe.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="group w-full relative flex items-center justify-center gap-3 px-4 py-3 bg-white text-black font-bold rounded-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700" />
            
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          By connecting, you agree to our Protocol Constraints & Data Policy.
        </div>
      </motion.div>
    </div>
  );
}