import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('router hooked up');
  return res.status(200).send('send success');
});

export default router;
