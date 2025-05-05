import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { withErrorHandling } from "@/lib/api-middleware";

const userSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

async function handler(req: Request) {
  try {
    const body = await req.json();
    console.log("Register request body:", JSON.stringify(body));
    
    const { name, email, password } = userSchema.parse(body);

    console.log("Checking if user exists:", email);
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists:", email);
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    console.log("Hashing password");
    // Hash the password
    const hashedPassword = await hash(password, 10);

    console.log("Creating user");
    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log("User created successfully:", user.id);
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    
    // Let the error middleware handle other errors
    throw error;
  }
}

export const POST = withErrorHandling(handler); 