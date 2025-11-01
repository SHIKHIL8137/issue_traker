export const errorHandler = (err, req, res, next) => {
  const statusCode =
    res && res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
console.error(err)
  res?.status(statusCode).json({
    message: err?.message || "Something went wrong",
    stack: process.env.NODE_ENV === "production" ? null : err?.stack,
  });
};
