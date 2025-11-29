import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/Error.js';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export function auth(required: boolean = true, roles: string[] = ['admin', 'student', 'teacher', 'cashier']) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return required ? next(new AppError('Missing token', 401)) : next();
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
        sub: string;
        email: string;
        role: string;
      };

      // attach user info
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role
      };

      // role check
      if (!roles.includes(payload.role)) {
        return next(new AppError('Forbidden: insufficient permissions', 403));
      }

      return next();
    } catch (err) {
      return next(new AppError('Invalid token', 401));
    }
  };
}

