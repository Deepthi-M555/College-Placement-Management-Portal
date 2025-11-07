// ✅ asyncHandler: catches errors inside async routes
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
