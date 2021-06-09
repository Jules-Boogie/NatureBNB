const mongoose = require('mongoose');

const expSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An experience needs a name'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'an experience must have a price'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Give users a description of the tour'],
  },
  ratingsAverage: {
    type: Number,
  },
  ratingsQuantity: {
    type: Number,
  },
  imageCover: {
    type: String,
    required: [true, 'An experience needs a cover'],
  },
  summary: {
    type: String,
    required: [true, 'Users need a summary of the experience'],
  },
  images: [String],
  startDates: [Date],
  duration: {
    type: Number,
    required: [true, 'Users need the duration of the experience'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Set a maximum size for an experience'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Experience = mongoose.model('Experience', expSchema);

module.exports = Experience;
