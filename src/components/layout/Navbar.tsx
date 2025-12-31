"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Terminal, Menu, X } from "lucide-react"; // Icons
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Events", href: "/events" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Alumni", href: "/alumni" },
  { name: "Team", href: "/team" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-obsidian/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-neon-cyan/10 rounded-lg group-hover:bg-neon-cyan/20 transition-colors">
              <Terminal className="w-6 h-6 text-neon-cyan" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">
              KPH<span className="text-neon-cyan">.</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 hover:text-neon-cyan transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Button Placeholder */}
          <div className="hidden md:block">
             <button className="px-4 py-2 text-sm font-bold text-obsidian bg-neon-cyan rounded-md hover:bg-neon-cyan/90 transition-transform active:scale-95">
                Join Hub
             </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Animated) */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-obsidian border-b border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}