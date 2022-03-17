import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {log} from '../logger';

interface User {
  _id: string;
  github_id: Number;
  login: string;
  avatar_url: string;
  name: string;
}

const user_fields = {
  github_id: {type: Number, unique: true, required: true},
  login: {type: String, unique: true, required: true},
  avatar_url: {type: String, unique: true, required: true},
  name: {type: String, unique: true, required: true},
};

const UserSchema = new Schema(user_fields, {timestamps: true});

const userModel = mongoose.model('user', UserSchema);

function getUser(id: string): User | undefined {
  userModel
    .findOne({_id: id})
    .then((user: User) => {
      return user;
    })
    .catch((err: any) => {
      log(`could not find user due to ${err}`);
    });
  return undefined;
}

//creates a user given a passport-generated github profile object
function createUser(profile: any) {
  return userModel
    .findOneAndUpdate(
      {github_id: profile.id},
      {
        github_id: profile.id,
        login: profile._json.login,
        avatar_url: profile._json.avatar_url,
        name: profile._json.name,
      },
      {upsert: true, new: true}
    )
    .catch((err: any) => {
      log('', `failed to update user during auth due to ${err}`);
    });
}

export default userModel;
export {getUser, createUser};
