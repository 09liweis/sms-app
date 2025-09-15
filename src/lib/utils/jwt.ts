import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

export const generateToken = (username: string, password: string): string => {
  return jwt.sign({ username, password }, JWT_SECRET, { expiresIn: '1d' });
};

export const decodeToken = (token: string): { username: string; password: string } => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === 'string' || !decoded.username || !decoded.password) {
    throw new Error('Invalid token');
  }
  return decoded as { username: string; password: string };
};

export const getAndDecodeTokenFromHeader = (request: Request): { username: string; password: string } => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header is missing or invalid');
  }
  const token = authHeader.split(' ')[1];
  return decodeToken(token);
};
