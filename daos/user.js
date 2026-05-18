import models from '../models'

// store a user record
export const createUser = async (userObj) => models.User.create(userObj);

// get the user record by email
export const getUser = async (email) => {
  if (!email) {
    return null;
  }
  return models.User.findOne({ email });
}

// delete user 
export const deleteAccount = async (email) => {
  if (!email) {
    return null;
  }
  return models.User.deleteOne({ email });
}