import express from 'express';
import * as Show from '../daos/show';
import { isAuthorized } from '../middleware/auth';

const router = express.Router();


router.post('/', isAuthorized, async (req, res) => {
  try {
    const { 
      name, 
      showDetails, 
      notes, 
      rating, 
      status, 
      ticketmasterId 
    } = req.body;
    
    const newShow = await Show.createShow({
      userId: req.user._id,
      name, 
      showDetails, 
      notes, 
      rating, 
      status, 
      ticketmasterId
    })
    return res.status(200).send(newShow);
  } catch (e) {
    // If duplicate sign up send 409.
    if (e.code === 11000) {
      return res.status(409).send(e.message);
    }
    return res.status(500).send(e.message);
  }
})

router.get('/', isAuthorized, async (req, res) => {
  try {
    const getAllUserShows = await Show.getShows({ userId: req.user._id });
    return res.status(200).send(getAllUserShows);
  } catch (e) {
    return res.status(500).send(e.message);
  }
})

router.put('/:id', isAuthorized, async (req, res) => {
  try {
    const { 
      name, 
      showDetails, 
      notes, 
      rating, 
      status, 
      ticketmasterId 
    } = req.body;
    const { id } = req.params;
    const updatedShow = await Show.updateShow(id, {
      name, 
      showDetails, 
      notes, 
      rating, 
      status, 
      ticketmasterId
    });
    return res.status(200).send(updatedShow);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

router.delete('/:id', isAuthorized, async (req, res) => {
  try {
    await Show.deleteShow(req.params.id);
    return res.status(200).send('show successfully deleted');
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

export default router;