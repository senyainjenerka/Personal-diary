const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authorization = req.get('Authorization');
  const match = typeof authorization === 'string' && authorization.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'Authorization token is missing or malformed' });
  }

  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    return res.status(401).json({ error: 'Invalid authorization token' });
  }
}

module.exports = authMiddleware;