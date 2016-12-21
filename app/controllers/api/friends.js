/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const  User = mongoose.model('User');

/**
* Fetch specific users by from database
* when a user needs to add a new friend
* @param{Object} req - the request object
* @param{Object} res - the result object
* @return {undefined} returns undefined
*/
exports.searchUsers = (req, res) => {
  const filter = req.query.name;
  if (filter) {
    User.find({ name: { $regex: filter } }).limit(10)
    .exec((err, users) => {
      if (err) {
        return res.json(err);
      }
      return res.json(users);
    });
  }
};

/**
* Fetch a specific user friends from the database
* when a user needs to add a new friend
* @param{Object} req - the request object
* @param{Object} res - the result object
* @return {undefined} returns undefined
*/
exports.getFriends = (req, res) => {
  const userEmail = req.decoded._doc.email;
  User.findOne({ email: userEmail })
    .exec((err, user) => {
      if (err) {
        return res.json(err);
      }
      // fetch all friends here data here
      User.find({ email: { $in: user.friends } })
      .exec((err, friends) => {
        if (err) {
          return res.json(err);
        }
        console.log('getFriends() ' + friends);
        return res.json(friends);
      });
    });
};

exports.addFriend = (req, res) => {
  const userEmail = req.decoded._doc.email;
  const friendEmail = req.body.friend_email;
  // get a user by his email
  User.findOne({ email: userEmail })
  .exec((err, user) => {
    if (err) {
      return res.json(err);
    }
    console.log(user.username);
    // ensure this user isn't already a friend
    console.log('about to ensure this friend doesn\'t exist');
    if (user.friends.indexOf(friendEmail) < 0) {
      // add a new friend by email
      user.friends.push(friendEmail);
      console.log(`Friends => ${user.friends}`);
      user.save();
      console.log('added a new friend');
    }
    // send the user his friends list
    //this.getFriends(req, res);
    res.send();
  });
};
