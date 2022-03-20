import mongoose from 'mongoose';
import {Schema} from 'mongoose';
import {log} from '../logger';
import {CONTENT_TYPE, INSECURE_SSL} from '../common/enum';
import {HookConfig, HookParams, HookEventName} from '../common/hook';

const hook_fields = {
  hook_id: {type: Number, unique: true, required: true},
  owner: {type: String, unique: true, required: true},
  repo: {type: String, unique: true, required: true},
};

const HookSchema = new Schema(hook_fields, {timestamps: true, _id: false});

const hookModel = mongoose.model('user', HookSchema);

export default hookModel;
export {hookModel};
