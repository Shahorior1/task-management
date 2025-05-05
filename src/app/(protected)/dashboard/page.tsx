import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TaskSummary } from "@/components/TaskSummary";
import { ProjectSummary } from "@/components/ProjectSummary";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return null;
  }
  
  // Get tasks and projects summary
  const [tasksCount, projectsCount, recentTasks] = await Promise.all([
    prisma.task.count({
      where: { userId: session.user.id },
    }),
    prisma.project.count({
      where: { userId: session.user.id },
    }),
    prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { project: true },
    }),
  ]);
  
  // Count tasks by status
  const todoTasks = await prisma.task.count({
    where: { userId: session.user.id, status: "TODO" },
  });
  
  const inProgressTasks = await prisma.task.count({
    where: { userId: session.user.id, status: "IN_PROGRESS" },
  });
  
  const completedTasks = await prisma.task.count({
    where: { userId: session.user.id, status: "DONE" },
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-black">Dashboard</h1>
        <div className="flex gap-2">
          <Link
            href="/tasks/new"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Task
          </Link>
          <Link
            href="/projects/new"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add Project
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <TaskSummary 
          totalTasks={tasksCount} 
          todoTasks={todoTasks}
          inProgressTasks={inProgressTasks} 
          completedTasks={completedTasks} 
        />
        <ProjectSummary totalProjects={projectsCount} />
      </div>

      <div className="bg-white shadow rounded-lg p-4 sm:p-6 border border-blue-100">
        <h2 className="text-lg font-bold text-black mb-4">Recent Tasks</h2>
        {recentTasks.length > 0 ? (
          <div className="divide-y divide-blue-100">
            {recentTasks.map((task) => (
              <div key={task.id} className="py-3 sm:py-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-bold text-black line-clamp-1">{task.title}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    task.status === "TODO" ? "bg-blue-100 text-black" : 
                    task.status === "IN_PROGRESS" ? "bg-yellow-100 text-black" : 
                    "bg-green-100 text-black"
                  }`}>
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm font-medium text-black mt-1 line-clamp-2">{task.description}</p>
                )}
                {task.project && (
                  <div className="mt-2">
                    <span className="text-xs font-bold bg-purple-100 px-2 py-1 rounded text-black">
                      {task.project.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-black font-medium">No tasks yet. Create your first task to get started!</p>
        )}
        
        {recentTasks.length > 0 && (
          <div className="mt-4">
            <Link 
              href="/tasks" 
              className="text-sm font-bold text-blue-600 hover:text-blue-500"
            >
              View all tasks →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 