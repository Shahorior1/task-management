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
    <div className="flex flex-col h-screen bg-blue-50">
      <div className="flex flex-1 overflow-hidden">
        <Navbar />
        <main className="ml-16 md:ml-60 flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
} 