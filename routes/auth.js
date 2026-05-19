import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as User from '../daos/user';
import 'dotenv/config';
import { isAuthorized } from '../middleware/auth';

const { JWT_SECRET } = process.env;

const router = express.Router();

// signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || password === '') {
      return res.status(400).send('password is required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.createUser({
      email,
      password: hashedPassword,
      roles: ['user'],
    });

    if (!user) {
      return res.status(500).send('server error');
    }

    return res.status(200).send('created');
  } catch (e) {
    // If duplicate sign up send 409.
    if (e.code === 11000) {
      return res.status(409).send(e.message);
    }
    return res.status(500).send(e.message);
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.getUser(email);
    if (!user) {
      return res.status(401).send('Not found');
    }
    if (!password) {
      return res.status(400).send('no password provided');
    }
    const hashedPassword = user.password;
    const isAuthenticated = await bcrypt.compare(password, hashedPassword);
    if (isAuthenticated) {
      const token = jwt.sign(
        { _id: user._id, email: user.email, roles: user.roles },
        JWT_SECRET,
        {
          expiresIn: '15m',
        },
      );
      return res.status(200).json({ token });
    }

    return res.status(401).send('unauthorized');
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

// delete
router.post('/delete', isAuthorized, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.deleteAccount(email);
    if (!user) {
      return res.status(401).send('Not found');
    }
    return res.status(200).send('account deleted successfully');
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

export default router;
