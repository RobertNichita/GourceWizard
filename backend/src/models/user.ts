import mongoose from 'mongoose';
import {Schema} from 'mongoose';

const user_fields = {
  github_id: {type: Number, unique: true, required: true},
};

const UserSchema = new Schema(user_fields, {timestamps: true});

const userModel = mongoose.model('user', UserSchema);

export default userModel;
// export {getUser, updateUser};
