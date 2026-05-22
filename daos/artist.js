import models from '../models';

export const createArtist = async (artistObj) =>
  models.Artist.create(artistObj);

export const getArtists = async (userId) => models.Artist.find(userId);

export const updateArtist = async (id, updatedObj) => {
  return models.Artist.findByIdAndUpdate(
    id,
    { $set: updatedObj },
    { returnDocument: 'after' }
  );
};

export const deleteArtist = async (id) => 
  models.Artist.findByIdAndDelete(id);

export const searchArtists = async (query) => 
  models.Artist.find({ $text: { $search: query } });
