/* AUTHENTICATION MIDDLEWARE
 * This can be added to any route to check for an authenticated user
 */
module.exports = function(req, res, next) {
  const user = req.session.user;
  if (!user) {
    res.redirect(302, '/');
    return;
  }
  next();
};
