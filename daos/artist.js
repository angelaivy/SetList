import models from '../models';
import mongoose from 'mongoose';

export const createArtist = async (artistObj) =>
  models.Artist.create(artistObj);

export const getArtists = async (userId) => models.Artist.find(userId);

export const updateArtist = async (id,userId, updatedObj) => {
  return await models.Artist.findOneAndUpdate(
    { _id: id, userId },
    { $set: updatedObj },
    { returnDocument: 'after' }
  );
};

export const deleteArtist = async (id, userId) => 
  models.Artist.findOneAndDelete({ _id: id, userId });

export const searchArtists = async (query) => 
  models.Artist.find({ $text: { $search: query } });
