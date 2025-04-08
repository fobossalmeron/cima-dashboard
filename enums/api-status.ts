export enum ApiStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum ApiStatusCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
