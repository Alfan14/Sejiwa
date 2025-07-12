import jwt from 'jsonwebtoken';
const { SECRET_KEY } = process.env;

function authenticate(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  const refreshToken = req.cookies['refreshToken'];

  if (!token && !refreshToken) {
    return res.status(401).send('Access Denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send('Access Denied. No refresh token provided.');
    }

    try {
      const decoded = jwt.verify(refreshToken, secretKey);
      const token = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '1h' });

      res
        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .header('Authorization', token)
        .send(decoded.user);
    } catch (error) {
      return res.status(400).send('Invalid Token.');
    }
  }
}

function authorize(roles = []) {
  return (req, res, next) => {
    if (!roles.length) return next();

    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access Denied' });
    }

    next();
  };
}

export default { authenticate, authorize };