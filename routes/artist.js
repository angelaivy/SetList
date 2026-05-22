import express from 'express';
import * as Artist from '../daos/artist';
import { isAuthorized } from '../middleware/auth';

const router = express.Router();

router.post('/', isAuthorized, async (req, res) => {
  try {
    const { name, genre, notes } = req.body;
    const newArtist = await Artist.createArtist({
      userId: req.user._id,
      name,
      genre,
      notes
    });
    return res.status(200).send(newArtist);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.get('/', isAuthorized, async (req, res) => {
  try {
    const { user } = req;
    const getUserArtists = await Artist.getArtists({ userId: user._id });
    return res.status(200).send(getUserArtists);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.put('/:id', isAuthorized, async (req, res) => {
  try {
    const { name, genre, notes } = req.body;
    const { id } = req.params;
    const updatedArtist = await Artist.updateArtist(id, {
      name,
      genre,
      notes,
    });
    return res.status(200).send(updatedArtist);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.delete('/:id', isAuthorized, async (req, res) => {
  try {
    await Artist.deleteArtist(req.params.id);
    return res.status(200).send('artist successfully deleted');
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
    const results = await Artist.searchArtists(query);
    return res.status(200).send(results);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

export default router;
