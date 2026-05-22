import models from '../models'

export const createShow = async (showObj) => models.Show.create(showObj);

export const getShows = async (userId) => models.Show.find(userId);

export const updateShow = async (id, updatedObj) => {
  if (!id || !updatedObj) return null;
  return models.Show.findByIdAndUpdate(
    id,
    { $set: updatedObj },
    { returnDocument: 'after' }
  );
}

export const deleteShow = async (id) => {
  if (!id) return null;
  return models.Show.findByIdAndDelete(id);
}

export const searchShows = async (query) => {
  if (!query) {
    return null;
  }
  return models.Show.find({ $text: { $search: query } });
};
