import jwt from 'jsonwebtoken';
const { SECRET_KEY } = process.env;

function authenticate(req, res, next) {
   const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Forbidden: No token provided" });
  }

  const token = authHeader.split(" ")[1]; 

  if (!process.env.SECRET_KEY) {
      console.error(" SECRET_KEY is not defined!");
      return res.status(500).json({ message: "Server error: Missing secret key" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
          console.error(" Token Verification Error:", err.message);
          return res.status(403).json({ message: "Forbidden: Invalid token" });
      }

      req.user = user; 
      next();
  });
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