import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  // 1. Update Type: params is a Promise
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. AWAIT the params to extract eventId safely
    const { eventId } = await params;

    // 3. Check if already registered
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: eventId, // Use the awaited variable
        },
      },
    });

    if (existingRegistration) {
      return new NextResponse("Already Registered", { status: 400 });
    }

    // 4. Create Registration
    await prisma.registration.create({
      data: {
        userId: session.user.id,
        eventId: eventId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EVENT_REGISTER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}