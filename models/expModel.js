const mongoose = require('mongoose');
const slugify = require('slugify');

const expSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An experience needs a name'],
    unique: true,
    trim:true,
    maxLength:[40, "Experience Name must be less than 41 characters"],
    minLength:[10, "Experience name must be more than 10 characters"]
  },
  price: {
    type: Number,
    required: [true, 'an experience must have a price'],
  },
  priceDiscount:{
    type: Number,
    validate:{
      validator:function(val){
        return val < this.price;
      },
      message:"Discounted Price {{VALUE}} should be less that regulat Price "
    }
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Give users a description of the tour'],
  },
  ratingsAverage: {
    type: Number,
    min:[1, "Rating must be above 0"],
    max:[5, "Rating must be below or equal to 5"]
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
  difficulty:{
    type: String,
    required: [true, "Experience must have difficulty"],
    enum:{values:["easy", "medium","difficult"], message:"Pick one of the values"}
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
// expSchema.pre('/^find/', function(next){
//   // for all the queries that start with find
// })
// expSchema.post('/^find/', function(doc,next){
//   // for after all queries that start find method has been executed
//   //this
// })

//aggregate middleware 
// expSchema.pre('aggregate', function(next){
//   console.log(this.pipeline)
// })

const Experience = mongoose.model('Experience', expSchema);

module.exports = Experience;
