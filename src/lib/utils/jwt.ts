import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key';

interface User {
  username: string;
  password: string;
  ip_address: string;
}

export const generateToken = (user: User): string => {
  return jwt.sign({ username: user.username, password: user.password, ip_address: user.ip_address }, JWT_SECRET, { expiresIn: '1d' });
};

export const decodeToken = (token: string): User => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === 'string' || !decoded.username || !decoded.password) {
    throw new Error('Invalid token');
  }
  return decoded as User;
};

export const getAndDecodeTokenFromHeader = (request: Request): User => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Authorization header is missing or invalid');
  }
  const token = authHeader.split(' ')[1];
  return decodeToken(token);
};
