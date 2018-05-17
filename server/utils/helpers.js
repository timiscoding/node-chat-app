export const catchAsyncError = fn => (req, res, next) => fn(req, res, next).catch(next);
