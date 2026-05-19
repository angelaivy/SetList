import express from 'express';
import * as Artist from '../daos/artist';
import { isAuthorized } from '../middleware/auth';

const router = express.Router();

router.post('/', isAuthorized, async (req, res) => {
  try {
    const { body, user } = req;
    const newArtist = await Artist.createArtist({
      userId: user._id,
      name: body.name,
      genre: body.genre,
      notes: body.notes,
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
    const { body } = req;
    const { id } = req.params;
    const updatedArtist = await Artist.updateArtist(id, {
      name: body.name,
      genre: body.genre,
      notes: body.notes,
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

export default router;
