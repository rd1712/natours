const AppError = require('./../utils/appError');

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something Went Wrong',
    msg: err.message
  });
};
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
  if (err.isOperational) {
    return res.status(404).render('error', {
      title: 'Something Went Wrong',
      msg: err.message
    });
  }
  return res.status(err.statusCode).render('error', {
    title: 'Something Went Wrong',
    msg: 'Please try again later'
  });
};
const handleJwtError = () =>
  new AppError('Invalid token. Please login again', 401);
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleJwtExpiredError = () =>
  new AppError('Your token has expired. Please login again', 401);
const handleDuplicateFieldsDB = err => {
  const value = err.message.match(
    /"([^"\\]|\\.|\\\n)*"|'([^'\\]|\\.|\\\n)*'/
  )[0];
  const message = `Duplicate Field Value ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
  const message = Object.values(err.errors)
    .map(el => {
      return el.message;
    })
    .join('. ');
  return new AppError(message, 400);
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJwtError();
    if (err.name === 'TokenExpiredError') error = handleJwtExpiredError();
    sendErrorProd(error, req, res);
  }
};
