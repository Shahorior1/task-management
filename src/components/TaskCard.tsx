"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiClock, FiList } from "react-icons/fi";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: string | null;
    project: {
      id: string;
      name: string;
    } | null;
  };
}

export function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();
  
  const statusIcon = () => {
    switch (task.status) {
      case "TODO":
        return <FiList className="text-blue-600 w-5 h-5" />;
      case "IN_PROGRESS":
        return <FiClock className="text-yellow-600 w-5 h-5" />;
      case "DONE":
        return <FiCheckCircle className="text-green-600 w-5 h-5" />;
    }
  };
  
  const priorityBadge = () => {
    const styles = {
      LOW: "bg-gray-100 text-black",
      MEDIUM: "bg-blue-100 text-black",
      HIGH: "bg-red-100 text-black",
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-bold rounded-full ${styles[task.priority]}`}>
        {task.priority}
      </span>
    );
  };

  return (
    <div 
      className="bg-white shadow rounded-lg p-3 sm:p-4 hover:shadow-md cursor-pointer transition-shadow border border-blue-100"
      onClick={() => router.push(`/tasks/${task.id}`)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {statusIcon()}
          <h3 className="font-bold text-black line-clamp-1">{task.title}</h3>
        </div>
        {priorityBadge()}
      </div>
      
      {task.description && (
        <p className="text-sm font-medium text-black mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex flex-wrap justify-between items-center gap-2">
        {task.dueDate && (
          <span className="text-xs font-bold text-black">
            Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
          </span>
        )}
        
        {task.project && (
          <Link 
            href={`/projects/${task.project.id}`} 
            className="text-xs font-bold bg-purple-100 px-2 py-1 rounded text-black hover:bg-purple-200"
            onClick={(e) => e.stopPropagation()}
          >
            {task.project.name}
          </Link>
        )}
      </div>
    </div>
  );
} 