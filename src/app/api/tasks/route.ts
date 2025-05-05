import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.string().optional().nullable(),
  projectId: z.string().optional().nullable(),
});

// Get all tasks for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
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
    });
    
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// Create a new task
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { title, description, status, priority, dueDate, projectId } = taskSchema.parse(body);
    
    // Process the projectId to handle empty strings
    const processedProjectId = projectId && projectId.trim() !== "" ? projectId : null;
    
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: session.user.id,
        projectId: processedProjectId,
      },
    });
    
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Task creation error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create task. Please check all fields and try again." },
      { status: 500 }
    );
  }
} 