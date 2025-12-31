"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileUpload } from "@/components/ui/FileUpload";
import { useRouter } from "next/navigation";
import { useState } from "react";

// 1. Validation Schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Give more details about the event"),
  date: z.string(),
  location: z.string().min(3),
  imageUrl: z.string().min(1, "Event poster is required"),
  type: z.enum(["WORKSHOP", "CONTEST", "HACKATHON", "MEETUP"]),
});

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "WORKSHOP",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      // We will create this API route in the next step
      const res = await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(values),
      });
      
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Initialize Event</h1>
        <p className="text-gray-400">Create a new protocol for the community.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Poster Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Holoposter</label>
          <FileUpload 
            value={form.watch("imageUrl")}
            onChange={(url) => form.setValue("imageUrl", url)}
          />
          {form.formState.errors.imageUrl && (
            <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Operation Name</label>
          <input
            {...form.register("title")}
            className="w-full bg-slate/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-cyan outline-none transition-all"
            placeholder="e.g. Intro to Neural Networks"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">T-Minus (Date)</label>
            <input
              type="datetime-local"
              {...form.register("date")}
              className="w-full bg-slate/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-cyan outline-none [color-scheme:dark]"
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Class</label>
            <select
              {...form.register("type")}
              className="w-full bg-slate/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-cyan outline-none"
            >
              <option value="WORKSHOP">Workshop</option>
              <option value="CONTEST">Contest</option>
              <option value="HACKATHON">Hackathon</option>
              <option value="MEETUP">Meetup</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Coordinates (Location)</label>
          <input
            {...form.register("location")}
            className="w-full bg-slate/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-cyan outline-none"
            placeholder="Room 303 or Zoom Link"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Briefing</label>
          <textarea
            {...form.register("description")}
            rows={5}
            className="w-full bg-slate/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-cyan outline-none resize-none"
            placeholder="Mission details..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-neon-cyan text-obsidian font-bold rounded-xl hover:shadow-[0_0_20px_#66FCF1] transition-all disabled:opacity-50"
        >
          {loading ? "Deploying..." : "Launch Event"}
        </button>
      </form>
    </div>
  );
}