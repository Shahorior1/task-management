// Utility function to convert Date objects to ISO strings for frontend use
export function normalizeTask(task: any) {
  return {
    ...task,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt ? task.createdAt.toISOString() : null,
    updatedAt: task.updatedAt ? task.updatedAt.toISOString() : null,
  };
} 