import { FiCheckCircle, FiClock, FiList } from "react-icons/fi";

interface TaskSummaryProps {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}

export function TaskSummary({
  totalTasks,
  todoTasks,
  inProgressTasks,
  completedTasks,
}: TaskSummaryProps) {
  // Calculate completion percentage
  const completionPercentage = 
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 col-span-2 border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
        <h2 className="text-lg font-bold text-slate-800">Task Summary</h2>
        <span className="text-sm font-medium text-slate-600">
          {completionPercentage}% Complete
        </span>
      </div>

      <div className="h-3 bg-slate-100 rounded-full mb-4 sm:mb-6">
        <div
          className="h-3 bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-md">
              <FiList className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">To Do</p>
              <p className="text-xl font-bold text-blue-700">{todoTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-md">
              <FiClock className="text-amber-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">In Progress</p>
              <p className="text-xl font-bold text-amber-700">{inProgressTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 p-3 sm:p-4 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-md">
              <FiCheckCircle className="text-emerald-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700">Completed</p>
              <p className="text-xl font-bold text-emerald-700">{completedTasks}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 