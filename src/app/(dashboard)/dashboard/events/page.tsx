import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { EventCard } from "@/components/events/EventCard";
import { CalendarX } from "lucide-react";

export default async function MyEventsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const userWithEvents = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      registrations: {
        include: {
          event: true,
        },
        // REMOVED: orderBy causing the crash
      },
    },
  });

  // Safe navigation: if userWithEvents is null, default to empty array
  const registeredEvents = userWithEvents?.registrations.map((r) => r.event) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">My Mission Log</h1>
        <p className="text-gray-400 mt-1">
          Tracking {registeredEvents.length} active protocols.
        </p>
      </div>

      {registeredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-slate/20">
          <div className="p-4 rounded-full bg-slate/50 mb-4">
            <CalendarX className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-white">No Active Missions</h3>
          <p className="text-gray-400 max-w-sm text-center mt-2 mb-6">
            You haven't registered for any events yet. Check the main dashboard for open protocols.
          </p>
          <a 
            href="/dashboard" 
            className="px-6 py-2 bg-neon-cyan text-obsidian font-bold rounded-lg hover:shadow-[0_0_15px_#66FCF1] transition-all"
          >
            Find Events
          </a>
        </div>
      )}
    </div>
  );
}