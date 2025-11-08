// middleware/auth.js
module.exports.requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).render('errors/401');
  next();
};

module.exports.requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) return res.status(403).render('errors/403');
  next();
};
