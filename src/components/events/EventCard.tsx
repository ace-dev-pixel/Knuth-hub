import Image from "next/image";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Event } from "@prisma/client";
import { format } from "date-fns"; 

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  // Define a fallback image (Cyberpunk placeholder)
  const fallbackImage = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"; 

  return (
    <div className="group relative ...">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          // THE FIX: If event.imageUrl is null, use the fallback
          src={event.imageUrl || fallbackImage} 
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 text-xs font-bold text-obsidian bg-neon-cyan rounded-full uppercase tracking-wider">
          {event.type}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 space-y-4">
        <div>
          <h3 className="text-xl font-display font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
            {event.description}
          </p>
        </div>

        <div className="mt-auto space-y-3 pt-4 border-t border-white/5">
          <div className="flex items-center text-sm text-gray-400 gap-2">
            <Calendar className="w-4 h-4 text-neon-cyan" />
            {/* Simple date formatting if date-fns isn't installed yet: */}
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-400 gap-2">
            <MapPin className="w-4 h-4 text-neon-cyan" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          href={`/dashboard/events/${event.slug}`}
          className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-neon-cyan hover:text-obsidian rounded-lg text-sm font-bold transition-all text-white"
        >
          View Details <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}