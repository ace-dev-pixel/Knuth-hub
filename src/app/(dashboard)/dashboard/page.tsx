import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { EventCard } from "@/components/events/EventCard";

// Fetch user data + Upcoming Events
async function getDashboardData(userId: string) {
  const [user, upcomingEvents] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { _count: { select: { registrations: true } } }
    }),
    prisma.event.findMany({
      where: { 
        isPublished: true,
        date: { gte: new Date() } // Only future events
      },
      orderBy: { date: 'asc' },
      take: 6 // Limit to 6 cards for the dashboard
    })
  ]);

  return { user, upcomingEvents };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { user, upcomingEvents } = await getDashboardData(session.user.id);

  return (
    <div className="space-y-10 pb-10">
      {/* 1. Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-gray-400 mt-1">
            System status: Online. Ready for deployment.
          </p>
        </div>
        {/* Admin Quick Action */}
        {session.user.role === "ADMIN" && (
          <a href="/admin/events/new" className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded-lg hover:bg-neon-cyan hover:text-obsidian transition-all text-sm font-bold">
            + Initialize Event
          </a>
        )}
      </div>

      {/* 2. Stats Grid (Keep your existing one) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate/30 border border-white/10">
          <div className="text-gray-400 text-sm font-medium mb-1">Upcoming Missions</div>
          <div className="font-mono text-4xl font-bold text-white">
            {upcomingEvents.length}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-slate/30 border border-white/10">
          <div className="text-gray-400 text-sm font-medium mb-1">Registrations</div>
          <div className="font-mono text-4xl font-bold text-white">
            {user?._count.registrations || 0}
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-slate/30 border border-white/10">
          <div className="text-gray-400 text-sm font-medium mb-1">Current Role</div>
          <div className="font-mono text-4xl font-bold text-neon-cyan uppercase">
            {user?.role}
          </div>
        </div>
      </div>

      {/* 3. The Mission Board (Events Grid) */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-neon-cyan rounded-full"/>
          Upcoming Operations
        </h2>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-slate/20">
            <p className="text-gray-400">No active operations found on the network.</p>
          </div>
        )}
      </div>
    </div>
  );
}