import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If user is authenticated, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">TaskMaster</h1>
          <div className="space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-slate-700 hover:text-indigo-600 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 md:py-28 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800">
              Manage Your Tasks with Ease
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-10">
              A powerful task management application for organizing your work,
              tracking deadlines, and collaborating with your team.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              Get Started — It's Free
            </Link>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">
              Features That Make Task Management Simple
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-700">Task Tracking</h3>
                <p className="text-slate-600">
                  Create, organize, and track tasks with custom statuses to stay on
                  top of your workload.
                </p>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg shadow-md border border-indigo-100 hover:shadow-lg transition-shadow">
                <div className="bg-indigo-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-indigo-700">Project Management</h3>
                <p className="text-slate-600">
                  Group related tasks into projects to better organize your work
                  and monitor progress.
                </p>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg shadow-md border border-purple-100 hover:shadow-lg transition-shadow">
                <div className="bg-purple-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-purple-700">Team Collaboration</h3>
                <p className="text-slate-600">
                  Collaborate with team members, assign tasks, and track progress
                  together in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-50 py-8 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>&copy; 2025 Shahorior. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
