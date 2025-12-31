import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { RedirectType } from "next/navigation";

async function getUserData(userId: string) {
  // Fetch user + their event registrations
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: { registrations: true }
      }
    }
  });
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await getUserData(session.user.id);

  return (
    <div className="space-y-8">
      {/* 1. Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-gray-400 mt-1">
            Here is what's happening in the hub today.
          </p>
        </div>
        <div className="px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-sm font-mono">
          System Online
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Events Attended */}
        <div className="p-6 rounded-2xl bg-slate border border-white/5 hover:border-neon-cyan/50 transition-colors group">
          <div className="text-gray-400 text-sm font-medium mb-1">Events Attended</div>
          <div className="font-mono text-4xl font-bold text-white group-hover:text-neon-cyan transition-colors">
            {user?._count.registrations || 0}
          </div>
        </div>

        {/* Card 2: Current Role */}
        <div className="p-6 rounded-2xl bg-slate border border-white/5">
          <div className="text-gray-400 text-sm font-medium mb-1">Access Level</div>
          <div className="font-mono text-4xl font-bold text-white uppercase">
            {user?.role}
          </div>
        </div>

        {/* Card 3: Placeholder for Rank */}
        <div className="p-6 rounded-2xl bg-slate border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
          </div>
          <div className="text-gray-400 text-sm font-medium mb-1">Global Rank</div>
          <div className="font-mono text-4xl font-bold text-gray-500">
            --
          </div>
          <div className="text-xs text-gray-500 mt-2">Participate in contests to unlock</div>
        </div>
      </div>
    </div>
  );
}