import { FiFolder } from "react-icons/fi";
import Link from "next/link";

interface ProjectSummaryProps {
  totalProjects: number;
}

export function ProjectSummary({ totalProjects }: ProjectSummaryProps) {
  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 border border-purple-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-black">Projects</h2>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-md">
          <FiFolder className="text-purple-600 w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-black">Total Projects</p>
          <p className="text-xl font-bold text-black">{totalProjects}</p>
        </div>
      </div>

      <Link 
        href="/projects" 
        className="text-sm font-bold text-purple-600 hover:text-purple-500"
      >
        View all projects →
      </Link>
    </div>
  );
} 