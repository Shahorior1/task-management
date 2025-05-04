import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { TaskCard } from "@/components/TaskCard";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import DeleteProject from "./DeleteProject";
import { use } from "react";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Unwrap params using React.use()
  const { id } = use(params);
  
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const project = await prisma.project.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
    include: {
      tasks: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">{project.name}</h1>
          {project.description && (
            <p className="text-black font-medium mt-1">{project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/projects/${project.id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiEdit2 className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <DeleteProject id={project.id} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h2 className="text-lg font-bold text-black">Tasks in this project</h2>
        <Link
          href={`/tasks/new?projectId=${project.id}`}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Task
        </Link>
      </div>

      {project.tasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {project.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 sm:p-8 text-center border border-purple-100">
          <h3 className="text-lg font-bold text-black mb-2">No tasks in this project yet</h3>
          <p className="text-black font-medium mb-4">
            Add your first task to get started.
          </p>
          <Link
            href={`/tasks/new?projectId=${project.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create a Task
          </Link>
        </div>
      )}
    </div>
  );
} 