const User = require('../models/user');

module.exports = (req, res) => {
  const query = req.params.email;
  User.find({ email: { $regex: query } }).limit(6)
    .exec((err, user) => {
      if (err) {
        return res.json(err);
      }
      return res.json(user);
    });
};
