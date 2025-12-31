"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, Zap } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

interface RegisterButtonProps {
  eventId: string;
  isRegistered: boolean;
}

export function RegisterButton({ eventId, isRegistered: initialStatus }: RegisterButtonProps) {
  const [isRegistered, setIsRegistered] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (isRegistered) return; // Prevent un-registering for now

    try {
      setLoading(true);
      // We will build this API endpoint in Step 3
      await axios.post(`/api/events/${eventId}/register`);
      
      setIsRegistered(true);
      router.refresh(); // Refresh the page to update UI counts
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRegister}
      disabled={loading || isRegistered}
      className={cn(
        "flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-95",
        isRegistered
          ? "bg-green-500/20 text-green-400 border border-green-500/50 cursor-default"
          : "bg-neon-cyan text-obsidian hover:shadow-[0_0_30px_rgba(102,252,241,0.4)]"
      )}
    >
      {loading ? (
        <span className="animate-pulse">Processing Request...</span>
      ) : isRegistered ? (
        <>
          <UserCheck className="w-6 h-6" />
          Mission Accepted
        </>
      ) : (
        <>
          <Zap className="w-6 h-6" />
          Initialize Registration
        </>
      )}
    </button>
  );
}