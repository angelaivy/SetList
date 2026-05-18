import jwt from 'jsonwebtoken';
import 'dotenv/config';

const { JWT_SECRET } = process.env;

// verify jwt
export const isAuthorized = (req, res, next) => {
  try {
    const [, token] = req.headers.authorization.split(' ');
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).send(e.message, 'unauthorized');
  }
}