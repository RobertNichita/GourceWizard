import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const auth_fields = {
  user_id: {type: String, unique: true, required: true},
  access_token: {type: String, unique: true, required: true},
  refresh_token: {type: String, unique: true, required: true},
};

const AuthSchema = new Schema(auth_fields, {timestamps: true});

const authModel = mongoose.model('authorization', AuthSchema);
export default authModel;
