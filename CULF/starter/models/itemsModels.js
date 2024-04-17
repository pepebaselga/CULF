const mongoose = require('mongoose');

const itemsSchema = new mongoose.Schema({
  item: {
    type: String,
    required: [true, 'An item must have a type']
  },
  type: { type: String },
  location: {
    type: String,
    required: [true, 'An item must have a location']
  },
  room: {
    type: Number
  },
  dateFound: {
    type: Date,
    required: [true, 'An item must include the date it was found or lost on']
  },
  claimed: {
    type: Boolean,
    required: [true, 'An item must have a claimed status'],
    default: false
  },
  images: {
    type: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  estimatedPrice: {
    type: Number
  },
  color: {
    type: String,
    required: true
  },
  model: {
    type: String
  },
  uniqueDescriptors: {
    type: String,
    trim: true
  }
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
