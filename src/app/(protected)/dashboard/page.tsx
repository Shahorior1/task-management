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
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/tasks/new"
            className="flex-1 sm:flex-initial inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Task
          </Link>
          <Link
            href="/projects/new"
            className="flex-1 sm:flex-initial inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add Project
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskSummary 
          totalTasks={tasksCount} 
          todoTasks={todoTasks}
          inProgressTasks={inProgressTasks} 
          completedTasks={completedTasks} 
        />
        <ProjectSummary totalProjects={projectsCount} />
      </div>

      <div className="bg-white shadow rounded-lg p-4 sm:p-6 border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Tasks</h2>
        {recentTasks.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {recentTasks.map((task) => (
              <div key={task.id} className="py-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  <h3 className="font-bold text-slate-800 line-clamp-1 flex-grow">{task.title}</h3>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full shrink-0 ${
                    task.status === "TODO" ? "bg-blue-100 text-blue-800 border border-blue-200" : 
                    task.status === "IN_PROGRESS" ? "bg-amber-100 text-amber-800 border border-amber-200" : 
                    "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}>
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm font-medium text-slate-600 mb-2 line-clamp-2">{task.description}</p>
                )}
                {task.project && (
                  <div className="mt-1">
                    <span className="text-xs font-bold bg-purple-100 px-2 py-1 rounded text-purple-800 border border-purple-200 inline-block">
                      {task.project.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 font-medium">No tasks yet. Create your first task to get started!</p>
        )}
        
        {recentTasks.length > 0 && (
          <div className="mt-4">
            <Link 
              href="/tasks" 
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center"
            >
              View all tasks 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 