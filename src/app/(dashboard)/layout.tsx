import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar"; 

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // 1. Protect the Route: If no session, kick them back to login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-obsidian text-white">
      {/* Reusing the Glass Navbar */}
      <Navbar />
      
      <div className="flex pt-16 h-[calc(100vh-4rem)]">
        {/* Animated Sidebar */}
        <Sidebar role={session.user.role} />
        
        {/* Main Content Area (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}