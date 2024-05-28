const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const itemsSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: [true, 'An item must have a type'],
      trim: true,
      maxLength: [40, 'An item must be under >= 40 characters'],
      minLength: [5, 'An item must be over <= 5 characteres']
      // validate: { //example usage of validator
      //   validator: validator.isAlpha,
      //   message: 'the type must only contain characters '
      // }
    },
    type: { type: String },
    slug: { type: String },
    location: {
      type: String,
      required: [true, 'An item must have a location'],
      trim: true
    },
    building: {
      type: String,
      default: null
    },
    room: {
      type: Number
    },
    dateFound: {
      type: Date,
      required: [true, 'An item must include the date it was found or lost on'],
      default: Date.now()
    },
    dateAdded: {
      type: Date,
      required: [true],
      default: Date.now(),
      selected: false,
      validate: {
        validator: function (val) {
          //this only points to current doc on NEW document creation
          return this.dateFound <= val;
        },
        message: 'Date found must be prior or equal to date added'
      }
    },
    claimed: {
      type: Boolean,
      required: [true, 'An item must have a claimed status'],
      default: false
    },
    dateClaimed: {
      type: Date,
      default: null
    },
    images: {
      type: [String],
      createdAt: {
        type: Date,
        default: Date.now()
      }
    },
    color: {
      type: String,
      trim: true,
      enum: {
        values: ['red', 'blue', 'white', 'green', 'red', 'grey', 'black'],
        message:
          'Colors are either red, blue, white, green, red, grey, or black'
      }
    },
    model: {
      type: String,
      trim: true
    },
    uniqueDescriptors: {
      type: String,
      trim: true
    },
    estimatePrice: {
      type: Number,
      default: null,
      min: [0, 'estimated price must be above 0$']
    },
    secretItem: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//values that can show up but are not saved to the data base
// itemsSchema.virtual('weeksLost').get(function () {
//   const today = new Date.now().getTime();
//   return Math.round(
//     (today - this.dateFound.getTime()) / (1000 * 3600 * 24 * 7)
//   );
// });

//DOCUMENT MIDDLEWARE: runs before (post after) .save() and .create()
itemsSchema.pre('save', function (next) {
  this.slug = slugify(this.item, { lower: true });
  next();
});

// itemsSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE --> hide secret (expensive)
itemsSchema.pre(/^find/, function (next) {
  this.find({ secretItem: { $ne: true } });
  this.start = Date.now();

  next();
});

itemsSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE:
itemsSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretItem: { $ne: true } }
  });
  next();
});

const Items = mongoose.model('items', itemsSchema);

// const testItem = new Items({
//   item: 'Watch',
//   type: 'Tissot',
//   location: 'West'
// });

// testItem.save().then((doc) => {
//   console.log(doc);
//   console.log('saved');
// });

module.exports = Items;
