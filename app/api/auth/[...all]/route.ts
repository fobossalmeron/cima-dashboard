import { NextRequest } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/services/auth";
import { errorHandler } from "@/errors";
import { handleAuthError } from "@/errors/auth-errors";

const handlers = toNextJsHandler(auth.handler);

async function handleRequest(method: 'GET' | 'POST', req: NextRequest) {
  try {
    const response = await handlers[method](req);

    if (!response.ok) {
      const data = await response.json();
      return handleAuthError(data);
    }

    return response;
  } catch (error) {
    return errorHandler(error);
  }
}

export async function GET(req: NextRequest) {
  return handleRequest('GET', req);
}

export async function POST(req: NextRequest) {
  return handleRequest('POST', req);
}
