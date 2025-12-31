import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Shield, Users } from "lucide-react";
import { format } from "date-fns";
import { RegisterButton } from "@/components/events/RegisterButton";

export const dynamic = "force-dynamic";

interface PageProps {
  // Correct Type: params is a Promise
  params: Promise<{
    slug: string;
  }>;
}

export default async function EventDetailsPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) return null;

  // 1. AWAIT the params first (Next.js 15+ requirement)
  const { slug } = await params;

  // 2. Fetch Event + Registration Status
  const event = await prisma.event.findUnique({
    where: { slug: slug }, // Use the awaited slug variable
    include: {
      _count: { select: { registrations: true } },
      registrations: {
        where: { userId: session.user.id },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const isRegistered = event.registrations.length > 0;
  const fallbackImage = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-white/10 group">
        <Image
          src={event.imageUrl || fallbackImage}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-neon-cyan text-obsidian text-xs font-extrabold uppercase tracking-widest rounded-full">
              {event.type}
            </span>
            {isRegistered && (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/50 text-xs font-bold uppercase tracking-widest rounded-full backdrop-blur-md">
                Registered
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 max-w-4xl leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-gray-300 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-neon-cyan" />
              {/* Ensure date object is valid before formatting */}
              {format(new Date(event.date), "PPP 'at' p")}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-neon-cyan" />
              {event.location}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-neon-cyan" />
              {event._count.registrations} Agents Deployed
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Description */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-2xl bg-slate/30 border border-white/5 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-neon-cyan" />
              Mission Briefing
            </h2>
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="space-y-6">
          <div className="sticky top-24 p-6 rounded-2xl bg-slate/50 border border-white/10 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-2">Protocol Action</h3>
            <p className="text-sm text-gray-400 mb-6">
              Confirm your attendance to receive clearance codes and access details.
            </p>
            
            <RegisterButton eventId={event.id} isRegistered={isRegistered} />
            
            <p className="mt-4 text-xs text-center text-gray-500">
              Secure connection established.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}