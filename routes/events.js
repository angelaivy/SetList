import express from 'express';

const router = express.Router();

const { TICKETMASTER_API_KEY } = process.env;
const size = 10;
const page = 1;
const tmApiEndpoint = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=${size}&page=${page}&apikey=${TICKETMASTER_API_KEY}`;

router.get('/', async (req, res) => {
  try {
    const response = await fetch(tmApiEndpoint);
    if (response.status === 401) {
      return res.sendStatus(401);
    }
    if (!response.ok) {
      return res.status(400).send(response.status);
    }
    const result = await response.json();
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

export default router;
