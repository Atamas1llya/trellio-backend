import mongoose, { Schema } from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';

const TaskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Task title is required!'],
  },
  description: {
    type: String,
    maxLength: 200,
  },
  status: {
    type: String,
    enum: ['active', 'complete'],
    default: 'active',
    requred: true,
  },
  attachments: [{
    type: String // url to attachment
  }],
  dueDate: Number,
  date: {
    type: Number,
    default: Date.now,
    required: true,
  },
  board: { // holding board _id
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

TaskSchema.plugin(beautifyUnique);

export default mongoose.model('Task', TaskSchema);
