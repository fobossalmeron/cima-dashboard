import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { User } from "better-auth";
import { auth } from "@/lib/services/auth";
import { errorHandler, UnauthorizedError } from "@/errors";

type RouteHandler<T> = (
  req: NextRequest,
  context: { params: Promise<T> },
  user?: User
) => Promise<NextResponse>;

export function withAuth<T>(handler: RouteHandler<T>) {
  return async (req: NextRequest, context: { params: Promise<T> }) => {
    try {
      // Primero intentamos autenticación por API key
      const headersList = await headers();

      // Si no hay API key o no es válida, intentamos autenticación web
      const session = await auth.api.getSession({
        headers: headersList,
      });

      if (!session) {
        throw new UnauthorizedError("No estás autenticado");
      }

      return handler(req, context, session.user);
    } catch (error) {
      return errorHandler(error);
    }
  };
}
