const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have name'],
    time: true,
  },
  email: {
    type: String,
    required: [true, 'User must have email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'must add password'],
    minLength: 8,
    maxLength: 20,
    trim: true,
  },

  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return this.password == val;
      },
      message: 'Password are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return;
  this.password = bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
