import mongoose, { Schema } from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

import Task from './task';

const BoardSchema = new Schema({
  title: { type: String, required: [true, 'Board title is required!'] },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

BoardSchema.plugin(beautifyUnique);

export default mongoose.model('Board', BoardSchema);
