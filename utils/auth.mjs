import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

export function verifyTokenFromHeaders(headers) {
  const token = headers.authorization?.split(' ')[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.SECRET_KEY); 
  } catch (err) {
    return null;
  }
}
