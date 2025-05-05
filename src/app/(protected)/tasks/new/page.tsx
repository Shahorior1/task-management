"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect } from "react";

const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export default function NewTaskPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "TODO",
      priority: "MEDIUM",
      dueDate: "",
      projectId: "",
    },
  });

  useEffect(() => {
    // Fetch available projects
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please refresh the page.");
      }
    };

    fetchProjects();
  }, []);

  const onSubmit = async (data: TaskFormValues) => {
    setIsLoading(true);
    setError("");

    // Handle empty projectId
    if (data.projectId === "") {
      data.projectId = null;
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create task");
      }

      router.push("/tasks");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create task");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Create New Task</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4 sm:p-6 border border-slate-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register("title")}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              {...register("description")}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add details about the task"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="mt-1 block w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-slate-700">
                Priority
              </label>
              <select
                id="priority"
                {...register("priority")}
                className="mt-1 block w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700">
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                {...register("dueDate")}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-slate-700">
                Project (optional)
              </label>
              <select
                id="projectId"
                {...register("projectId")}
                className="mt-1 block w-full pl-3 pr-10 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">None</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6">
            <Link
              href="/tasks"
              className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 