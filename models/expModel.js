const mongoose = require('mongoose');
const slugify = require('slugify');

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
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});


//virtual properties
expSchema.virtual('durationInWeeks').get(function(){
  return this.duration / 7;
})

//document middleware
// expSchema.pre('save', function(next){
//   this.slug = slugify(this.name)
//   console.log(this);
//   next();
// })

// expSchema.post('save', function(doc,next){
//   console.log(doc);
//   next();
// })

//query middleware 

const Experience = mongoose.model('Experience', expSchema);

module.exports = Experience;
