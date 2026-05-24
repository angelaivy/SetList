import express from 'express';
import * as Show from '../daos/show';
import { isAuthorized } from '../middleware/auth';

const router = express.Router();

router.post('/', isAuthorized, async (req, res) => {
  try {
    const { name, showDetails, notes, rating, status, ticketmasterId } =
      req.body;

    const newShow = await Show.createShow({
      userId: req.user._id,
      name,
      showDetails,
      notes,
      rating,
      status,
      ticketmasterId,
    });
    return res.status(200).send(newShow);
  } catch (e) {
    // If duplicate sign up send 409.
    if (e.code === 11000) {
      return res.status(409).send(e.message);
    }
    return res.status(500).send(e.message);
  }
});

router.get('/', isAuthorized, async (req, res) => {
  try {
    const getAllUserShows = await Show.getShows({ userId: req.user._id });
    if (!getAllUserShows) {
      return res.sendStatus(401);
    }
    return res.status(200).send(getAllUserShows);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.put('/:id', isAuthorized, async (req, res) => {
  try {
    const { name, showDetails, notes, rating, status, ticketmasterId } =
      req.body;
    const { id } = req.params;
    const updatedShow = await Show.updateShow(id, req.user._id, {
      name,
      showDetails,
      notes,
      rating,
      status,
      ticketmasterId,
    });
    if (!updatedShow) {
      return res.sendStatus(401);
    }
    return res.status(200).send(updatedShow);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.delete('/:id', isAuthorized, async (req, res) => {
  try {
    const showToDelete = await Show.deleteShow(req.params.id, req.user._id);
    if (!showToDelete) {
      return res.sendStatus(401);
    }
    return res.sendStatus(200).send('show successfully deleted');
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.get('/search', isAuthorized, async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).send('Search query required');
    }
    const results = await Show.searchShows(query);
    return res.status(200).send(results);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

export default router;
