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
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">TaskMaster</h1>
          <div className="space-x-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Manage Your Tasks with Ease
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              A powerful task management application for organizing your work,
              tracking deadlines, and collaborating with your team.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Get Started — It's Free
            </Link>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Features That Make Task Management Simple
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Task Tracking</h3>
                <p className="text-gray-600">
                  Create, organize, and track tasks with custom statuses to stay on
                  top of your workload.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Project Management</h3>
                <p className="text-gray-600">
                  Group related tasks into projects to better organize your work
                  and monitor progress.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
                <p className="text-gray-600">
                  Collaborate with team members, assign tasks, and track progress
                  together in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
