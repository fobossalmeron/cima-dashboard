import { NextResponse } from "next/server";
import { AppError } from "./app-error";

export function errorHandler(error: unknown) {
  // Si es un error de aplicación controlado
  if (error instanceof AppError) {
    console.error({
      name: error.name,
      message: error.message,
      stack: error.stack,
      context: error.context,
    });
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.statusCode },
    );
  }

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error interno del servidor",
      },
    },
    { status: 500 },
  );
}
