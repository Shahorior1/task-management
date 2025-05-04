import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { FiCheckCircle, FiClock, FiList, FiEdit2, FiTrash2 } from "react-icons/fi";
import DeleteTask from "./DeleteTask";
import { use } from "react";

export default async function TaskDetailPage({
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

  const task = await prisma.task.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
    include: {
      project: true,
    },
  });

  if (!task) {
    notFound();
  }

  const getStatusIcon = () => {
    switch (task.status) {
      case "TODO":
        return <FiList className="text-blue-600 w-6 h-6" />;
      case "IN_PROGRESS":
        return <FiClock className="text-yellow-600 w-6 h-6" />;
      case "DONE":
        return <FiCheckCircle className="text-green-600 w-6 h-6" />;
    }
  };

  const getPriorityBadge = () => {
    const styles = {
      LOW: "bg-gray-100 text-black",
      MEDIUM: "bg-blue-100 text-black",
      HIGH: "bg-red-100 text-black",
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-bold rounded-full ${styles[task.priority]}`}
      >
        {task.priority}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 border border-blue-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <h1 className="text-xl sm:text-2xl font-bold text-black">{task.title}</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/tasks/${task.id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiEdit2 className="w-4 h-4 mr-2" />
              Edit
            </Link>
            <DeleteTask id={task.id} />
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <h2 className="text-lg font-bold text-black">Details</h2>
            <div className="mt-3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-black">Status</p>
                  <p className="mt-1 font-bold text-black">
                    {task.status.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-black">Priority</p>
                  <div className="mt-1">{getPriorityBadge()}</div>
                </div>
              </div>

              {task.dueDate && (
                <div>
                  <p className="text-sm font-medium text-black">Due Date</p>
                  <p className="mt-1 font-bold text-black">
                    {format(new Date(task.dueDate), "MMM d, yyyy")}
                  </p>
                </div>
              )}

              {task.project && (
                <div>
                  <p className="text-sm font-medium text-black">Project</p>
                  <Link
                    href={`/projects/${task.project.id}`}
                    className="mt-1 inline-block text-purple-600 hover:text-purple-800 font-bold"
                  >
                    {task.project.name}
                  </Link>
                </div>
              )}

              {task.description && (
                <div>
                  <p className="text-sm font-medium text-black">Description</p>
                  <p className="mt-1 whitespace-pre-wrap text-black font-medium">{task.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 