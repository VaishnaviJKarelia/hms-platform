import jwt from 'jsonwebtoken';
import { IJWTPayload, IAuthTokens } from '../types';

export class AuthService {
  private static getJWTSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return secret;
  }

  private static getRefreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }
    return secret;
  }

  static generateAccessToken(payload: IJWTPayload): string {
    return jwt.sign(payload, this.getJWTSecret(), {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
  }

  static generateRefreshToken(payload: IJWTPayload): string {
    return jwt.sign(payload, this.getRefreshSecret(), {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
  }

  static generateTokens(payload: IJWTPayload): IAuthTokens {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  static verifyAccessToken(token: string): IJWTPayload {
    try {
      return jwt.verify(token, this.getJWTSecret()) as IJWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  static verifyRefreshToken(token: string): IJWTPayload {
    try {
      return jwt.verify(token, this.getRefreshSecret()) as IJWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  static decodeToken(token: string): IJWTPayload | null {
    try {
      return jwt.decode(token) as IJWTPayload;
    } catch (error) {
      return null;
    }
  }
}
