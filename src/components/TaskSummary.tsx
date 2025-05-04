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
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 col-span-2 border border-blue-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mb-4">
        <h2 className="text-lg font-bold text-black">Task Summary</h2>
        <span className="text-sm font-medium text-black">
          {completionPercentage}% Complete
        </span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full mb-4 sm:mb-6">
        <div
          className="h-2 bg-green-500 rounded-full"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-md">
              <FiList className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">To Do</p>
              <p className="text-xl font-bold text-black">{todoTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-md">
              <FiClock className="text-yellow-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">In Progress</p>
              <p className="text-xl font-bold text-black">{inProgressTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-md">
              <FiCheckCircle className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">Completed</p>
              <p className="text-xl font-bold text-black">{completedTasks}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 