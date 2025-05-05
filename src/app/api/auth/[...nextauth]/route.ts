import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Creating a NextAuth handler with explicit authOptions
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 