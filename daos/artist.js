import models from '../models';

export const createArtist = async (artistObj) =>
  models.Artist.create(artistObj);

export const getArtists = async (userId) => models.Artist.find(userId);

export const getArtistById = async (id) => {
  if (!id) {
    return null;
  }
  return models.Artist.findById(id);
};

export const updateArtist = async (id, updatedObj) => {
  if (!id || !updatedObj) {
    return null;
  }
  return models.Artist.findByIdAndUpdate(
    id,
    { $set: updatedObj },
    { returnDocument: 'after' }
  );
};

export const deleteArtist = async (id) => {
  if (!id) {
    return null;
  }
  return models.Artist.findByIdAndDelete(id);
};

export const searchArtists = async (query) => {
  if (!query) {
    return null;
  }
  return models.Artist.find({ $text: { $search: query } });
};
