export class PrimroseError extends Error {
  readonly code: string;
  readonly status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.name = 'PrimroseError';
    this.code = code;
    this.status = status;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, PrimroseError.prototype);
  }
}
