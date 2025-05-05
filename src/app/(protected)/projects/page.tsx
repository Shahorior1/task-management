import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { FiFolder } from "react-icons/fi";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          tasks: true,
        },
      },
    },
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-black">My Projects</h1>
        <Link
          href="/projects/new"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Add Project
        </Link>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {projects.map((project) => (
            <Link
              href={`/projects/${project.id}`}
              key={project.id}
              className="bg-white shadow rounded-lg p-3 sm:p-6 hover:shadow-md transition-shadow border border-purple-100"
            >
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="p-2 bg-purple-100 rounded-md">
                  <FiFolder className="text-purple-600 w-5 h-5" />
                </div>
                <h3 className="font-bold text-black line-clamp-1">{project.name}</h3>
              </div>
              {project.description && (
                <p className="text-sm font-medium text-black mb-3 sm:mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}
              <div className="text-sm font-bold text-black">
                {project._count.tasks} task{project._count.tasks !== 1 && "s"}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 sm:p-8 text-center border border-purple-100">
          <h3 className="text-lg font-bold text-black mb-2">No projects yet</h3>
          <p className="text-black font-medium mb-4">
            Create your first project to organize your tasks better.
          </p>
          <Link
            href="/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Create a Project
          </Link>
        </div>
      )}
    </div>
  );
} 