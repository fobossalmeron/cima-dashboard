import { AppError } from './app-error';

interface AuthErrorData {
  message: string;
  code: string;
}

interface AuthErrorResponse {
  error?: AuthErrorData;
  message?: string;
  code?: string;
}

const AUTH_ERROR_MESSAGES: Record<string, { message: string; status: number }> = {
  USER_NOT_FOUND: {
    message: 'No existe una cuenta con este correo electrónico',
    status: 404
  },
  FAILED_TO_CREATE_USER: {
    message: 'No se pudo crear la cuenta. Por favor, intenta nuevamente',
    status: 400
  },
  FAILED_TO_CREATE_SESSION: {
    message: 'Error al iniciar sesión. Por favor, intenta nuevamente',
    status: 400
  },
  FAILED_TO_UPDATE_USER: {
    message: 'No se pudo actualizar la información de la cuenta',
    status: 400
  },
  FAILED_TO_GET_SESSION: {
    message: 'Error al recuperar la sesión. Por favor, inicia sesión nuevamente',
    status: 401
  },
  INVALID_PASSWORD: {
    message: 'La contraseña proporcionada es incorrecta',
    status: 401
  },
  INVALID_EMAIL: {
    message: 'El correo electrónico proporcionado no es válido',
    status: 400
  },
  INVALID_EMAIL_OR_PASSWORD: {
    message: 'El correo electrónico o la contraseña son incorrectos',
    status: 401
  },
  SOCIAL_ACCOUNT_ALREADY_LINKED: {
    message: 'Esta cuenta social ya está vinculada a otro usuario',
    status: 400
  },
  PROVIDER_NOT_FOUND: {
    message: 'Proveedor de autenticación no encontrado',
    status: 404
  },
  INVALID_TOKEN: {
    message: 'Token de autenticación inválido',
    status: 401
  },
  ID_TOKEN_NOT_SUPPORTED: {
    message: 'Token de ID no soportado',
    status: 400
  },
  FAILED_TO_GET_USER_INFO: {
    message: 'No se pudo obtener la información del usuario',
    status: 400
  },
  USER_EMAIL_NOT_FOUND: {
    message: 'No se encontró el correo electrónico asociado',
    status: 404
  },
  EMAIL_NOT_VERIFIED: {
    message: 'El correo electrónico no ha sido verificado',
    status: 400
  },
  PASSWORD_TOO_SHORT: {
    message: 'La contraseña es demasiado corta',
    status: 400
  },
  PASSWORD_TOO_LONG: {
    message: 'La contraseña es demasiado larga',
    status: 400
  },
  USER_ALREADY_EXISTS: {
    message: 'Ya existe una cuenta con este correo electrónico',
    status: 409
  },
  EMAIL_CAN_NOT_BE_UPDATED: {
    message: 'No se puede actualizar el correo electrónico',
    status: 400
  },
  CREDENTIAL_ACCOUNT_NOT_FOUND: {
    message: 'No se encontraron las credenciales de la cuenta',
    status: 404
  },
  SESSION_EXPIRED: {
    message: 'La sesión ha expirado. Por favor, inicia sesión nuevamente',
    status: 401
  },
  FAILED_TO_UNLINK_LAST_ACCOUNT: {
    message: 'No se puede desvincular la última cuenta asociada',
    status: 400
  },
  ACCOUNT_NOT_FOUND: {
    message: 'Cuenta no encontrada',
    status: 404
  }
};

export class AuthError extends AppError {
  constructor(data: AuthErrorData) {
    const errorInfo = AUTH_ERROR_MESSAGES[data.code] || {
      message: data.message || 'Error de autenticación',
      status: 400
    };

    super(
      errorInfo.message,
      errorInfo.status,
      `AUTH_${data.code}`,
      { originalError: data }
    );
  }
}

export function handleAuthError(data: AuthErrorResponse): never {
  // Normalizamos la estructura del error
  const errorData: AuthErrorData = {
    message: data.error?.message || data.message || 'Error de autenticación',
    code: data.error?.code || data.code || 'UNKNOWN_ERROR'
  };

  throw new AuthError(errorData);
} 