import jwt from 'jsonwebtoken';
import {config} from 'dotenv'
config()

export const generateToken = (id, role, name, email) => {
  return jwt.sign({ id, role, name, email }, process.env.JWT_SECRET, {
    expiresIn: '30d' // 30-day token for cookie-based auth
  });
};

export const generateAccessToken = (id, role, name, email) => {
  return jwt.sign({ id, role, name, email }, process.env.JWT_SECRET, {
    expiresIn: '15m' // Short-lived access token
  });
};

export const generateRefreshToken = (id, role, name, email) => {
  return jwt.sign({ id, role, name, email }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '7d' // Long-lived refresh token
  });
};