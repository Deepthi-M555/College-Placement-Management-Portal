function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).render('errors/401');
  next();
}
function requireRole(role) {
  return (req,res,next) => req.user?.role === role ? next() : res.status(403).render('errors/403');
}
module.exports = { requireAuth, requireRole };
