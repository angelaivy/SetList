import models from '../models';

export const createShow = async (showObj) => models.Show.create(showObj);

export const getShows = async (userId) => models.Show.find(userId);

export const updateShow = async (id, userId, updatedObj) =>
  models.Show.findOneAndUpdate(
    { _id: id, userId },
    { $set: updatedObj },
    { returnDocument: 'after' },
  );

export const deleteShow = async (id, userId) =>
  models.Show.findOneAndDelete({ _id: id, userId });

export const searchShows = async (query, userId) =>
  models.Show.find({ $text: { $search: query }, userId });
