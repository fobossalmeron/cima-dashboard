import { AppError } from './app-error';

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, 'VALIDATION_ERROR', context);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND_ERROR');
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string) {
    super(message, 422, 'BUSINESS_RULE_ERROR');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message?: string) {
    super(message || 'No autorizado', 401, 'UNAUTHORIZED_ERROR');
  }
}

export class BadRequestError extends AppError {
  constructor(message?: string) {
    super(message || 'Solicitud incorrecta', 400, 'BAD_REQUEST_ERROR');
  }
}


