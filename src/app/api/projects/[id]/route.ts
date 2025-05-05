import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const projectUpdateSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).optional(),
  description: z.string().optional().nullable(),
});

// Get a specific project with its tasks
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// Update a project
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, description } = projectUpdateSchema.parse(body);

    const updatedProject = await prisma.project.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// Delete a project
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete associated tasks first (if cascade doesn't work)
    await prisma.task.deleteMany({
      where: {
        projectId: params.id,
      },
    });

    // Delete the project
    await prisma.project.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
} 