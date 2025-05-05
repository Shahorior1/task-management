import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 pt-16 pb-16 md:pt-6 md:pb-8 md:ml-60 px-4 sm:px-6 md:px-8 overflow-auto">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
} 