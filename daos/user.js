import models from '../models'

// store a user record
export const createUser = async (userObj) => models.User.create(userObj);
