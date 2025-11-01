import jwt from 'jsonwebtoken';
import {config} from 'dotenv'
config()

export const generateToken = (id, role, name, email) => {
  return jwt.sign({ id, role, name, email }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const generateAccessToken = (id, role, name, email) => {
  return jwt.sign({ id, role, name, email }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });
};

export const generateRefreshToken = (id, role, name, email) => {
  return jwt.sign({ id, role, name, email }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};