export class InvalidTokenException extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'InvalidTokenException'
    this.statusCode = statusCode
  }
}
