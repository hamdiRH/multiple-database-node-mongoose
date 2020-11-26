import jwt, { decode } from 'jsonwebtoken';
import config from '../config';
import { verifyToken } from '../services/token.service';

const authAdmin = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  // Verify token
  try {
    jwt.verify(token, config.jwt.secret, (error, decoded) => {
      if (error) {
        res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded.sub;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};

const auth = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  // Verify token
  try {
    // TODO: verify token with token service
    // const { Token } = global.App.clientModel[req.subdomains[1]];
    // await verifyToken(Token, token, 'access');
    jwt.verify(token, config.jwt.secret, (error, decoded) => {
      if (error) {
        res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded.sub;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};

const authSuperUser = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  // Verify token
  try {
    // TODO: verify token with token service
    // const { Token } = global.App.clientModel[req.subdomains[1]];
    // await verifyToken(Token, token, 'access');
    jwt.verify(token, config.jwt.secret, (error, decoded) => {
      if (error || !(decoded.sub.isAdmin || decoded.sub.post === 'Manager' || decoded.sub.post === 'Associate')) {
        res.status(401).json({ msg: 'Token is not valid' });
      } else {
        req.user = decoded.sub;
        next();
      }
    });
  } catch (err) {
    console.error('something wrong with auth middleware');
    res.status(500).json({ msg: 'Server Error' });
  }
};

export default { authAdmin, authSuperUser, auth };
