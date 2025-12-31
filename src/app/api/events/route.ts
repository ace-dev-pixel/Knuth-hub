import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

// 1. Validation Schema (Must match frontend)
const eventSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  date: z.string(), // Received as ISO string
  location: z.string().min(3),
  imageUrl: z.string().min(1),
  type: z.enum(["WORKSHOP", "CONTEST", "HACKATHON", "MEETUP"]),
});

export async function POST(req: Request) {
  try {
    // 2. Security Check: Are you authorized?
    const session = await auth();
    
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized: Command Access Required", { status: 401 });
    }

    // 3. Parse Input
    const body = await req.json();
    const validatedData = eventSchema.parse(body);

    // 4. Create in Database
    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date), // Convert string to Date object
        location: validatedData.location,
        imageUrl: validatedData.imageUrl,
        type: validatedData.type,
        slug: validatedData.title.toLowerCase().replace(/ /g, "-") + "-" + Date.now(), // Auto-slug
        isPublished: true,
      },
    });

    return NextResponse.json(event);

  } catch (error) {
    console.error("[EVENTS_POST]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid Data", { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}