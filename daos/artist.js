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
    { _id: id },
    {
      name: updatedObj.name,
      genre: updatedObj.genre,
      notes: updatedObj.notes,
    },
  );
};

export const deleteArtist = async (id) => {
  if (!id) {
    return null;
  }
  return models.Artist.findByIdAndDelete(id);
};
