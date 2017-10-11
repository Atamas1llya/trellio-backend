import mongoose, { Schema } from 'mongoose';
import beautifyUnique from 'mongoose-beautiful-unique-validation';
import bcrypt from 'bcrypt-as-promised';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: [true, 'This email is already in use'] },
  name: { type: String, },
  password: { type: String, required: true, minlength: 6 },
});

UserSchema.plugin(beautifyUnique);

UserSchema.pre('save', async function (next) {
  if (!this.isModified()) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
  next();
});


UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
