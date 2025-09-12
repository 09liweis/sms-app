import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

export const generateToken = (username: string, password: string): string => {
  return jwt.sign({ username, password }, JWT_SECRET, { expiresIn: '1h' });
};

export const decodeToken = (token: string): { username: string; password: string } => {
  return jwt.verify(token, JWT_SECRET) as { username: string; password: string };
};
