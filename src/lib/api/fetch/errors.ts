// Error for developers: use this to throw exceptions when a developer is
// using something not in the intended way
export class InterfaceError extends Error {}

// Error for user's input value errors
export class ValueError<T> extends Error {
  private readonly _invalidValue: T;

  public get value(): T {
    return this._invalidValue;
  }

  constructor(value: T, message?: string) {
    super(message);
    this._invalidValue = value;
  }
}

export class ParseError<T> extends ValueError<T> {}

export class InvalidOption extends Error {}

export class UnsupportedFileType extends InvalidOption {
  constructor(fileType: string) {
    super(`Unsupported file type: ${fileType}`);
  }
}

export type RequestErrorData = {
  readonly code: string;
  readonly detail: string;
};

export class ApplicationError extends Error {
  readonly status: number;
  readonly data?: unknown;
  readonly retry?: () => void;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.status = statusCode;
    this.retry = undefined;
    this.data = data;
  }

  allowRetry(): boolean {
    return this.status === 500;
  }
}

export class BadRequestError extends ApplicationError {
  constructor(statusCode: number, readonly data: RequestErrorData) {
    super(`HTTP error: ${statusCode} ${data.detail}`, statusCode, data);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message: string = 'Object not found') {
    super(message, 404);
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}

export class PreconditionFailedError extends ApplicationError {
  constructor(message: string = 'Precondition failed') {
    super(message, 412);
  }
}

export class UserCancelledOperation extends ApplicationError {
  constructor(message: string = 'The user cancelled the operation') {
    super(message, -2);
  }
}
