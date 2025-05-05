import { NextResponse } from 'next/server';

type ApiHandler = (req: Request, ...args: any[]) => Promise<Response>;

/**
 * API middleware that wraps route handlers with error handling
 */
export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (req, ...args) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      console.error(`API Error (${req.method} ${req.url}):`, error);
      
      return NextResponse.json(
        { 
          error: 'Internal Server Error', 
          message: process.env.NODE_ENV === 'development' 
            ? (error instanceof Error ? error.message : String(error)) 
            : 'An unexpected error occurred'
        },
        { status: 500 }
      );
    }
  };
} 