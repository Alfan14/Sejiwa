import  jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY ;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Received Auth Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Forbidden: No token provided" });
  }

  const token = authHeader.split(" ")[1]; 
  console.log("Extracted Token:", token);

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
      console.log(" Decoded User:", user);
      next();
  });
};


export default authenticateJWT;