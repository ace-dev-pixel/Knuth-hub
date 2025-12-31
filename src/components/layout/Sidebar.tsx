"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Calendar, 
  Trophy, 
  Users, 
  ShieldAlert,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Events", href: "/dashboard/events", icon: Calendar },
  { name: "Contests", href: "/dashboard/contests", icon: Trophy },
  { name: "Settings", href: "/dashboard/settings", icon: Code },
];

const adminLinks = [
  { name: "Admin Panel", href: "/admin", icon: ShieldAlert },
  { name: "Manage Users", href: "/admin/users", icon: Users },
];

export function Sidebar({ role }: { role?: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-white/10 bg-slate/30 backdrop-blur-sm h-full">
      <div className="flex flex-col gap-2 p-4">
        <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Menu
        </p>
        
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div className="relative group">
                {/* Active Indicator (Glowing Line) */}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-full bg-neon-cyan rounded-r-full shadow-[0_0_10px_#66FCF1]"
                  />
                )}
                
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-white/5 text-neon-cyan" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </div>
              </div>
            </Link>
          );
        })}

        {/* Admin Section (Only visible to Admins) */}
        {role === "ADMIN" && (
          <>
            <div className="my-2 border-t border-white/10" />
            <p className="px-4 text-xs font-bold text-neon-cyan/80 uppercase tracking-wider mb-2 mt-2">
              Command Mode
            </p>
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </div>
              </Link>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}