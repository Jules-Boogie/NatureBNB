class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // prevent the object from getting added to the stack trace to polute it.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
