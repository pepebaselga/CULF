const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  netID: {
    type: String,
    required: [true, 'A user must have a type'],
    unique: true
  },
  itemsFound: {
    type: Number,
    default: 0
  },
  itemsLost: {
    type: Number,
    required: [true, 'All users must include items lost'],
    default: 0
  },
  phoneNumber: {
    type: Number
  }
});
const Users = mongoose.model('users', usersSchema);

// const testUser = new Users({
//   netID: 'noj5'
// });

// testUser
//   .save()
//   .then((doc) => {
//     console.log(doc);
//     console.log('saved!!!!!!');
//   })
//   .catch((err) => console.log('error'));

module.exports = Users;
