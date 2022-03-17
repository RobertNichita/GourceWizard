import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {log} from '../logger';

interface Auth {
  user_id: string;
  access_token: string;
  refresh_token: string;
}

const auth_fields = {
  user_id: {type: String, unique: true, required: true},
  access_token: {type: String, unique: true, required: true},
  refresh_token: {type: String, unique: true, required: true},
};

const AuthSchema = new Schema(auth_fields, {timestamps: true});

function getAuth(id: string): Auth | undefined {
  authModel
    .findOne({user_id: id})
    .then((user: Auth) => {
      return user;
    })
    .catch((err: any) => {
      log('', `could not find user due to ${err}`);
    });
  return undefined;
}

function createAuth(user: any, accessToken: string, refreshToken: string) {
  return authModel
    .findOneAndUpdate(
      {
        user_id: user._id,
      },
      {
        user_id: user._id,
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      {upsert: true, new: true}
    )
    .catch((err: any) => {
      log('', `failed to update auth info during auth due to ${err}`);
    });
}

const authModel = mongoose.model('authorization', AuthSchema);
export default authModel;
export {getAuth, createAuth};
