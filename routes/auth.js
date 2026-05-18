import express from 'express';
import bcrypt from 'bcrypt';
import * as User from '../daos/user';

const router = express.Router();

// POST /auth/signup
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

export default router;
