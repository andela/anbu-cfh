/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config'),
    Schema = mongoose.Schema;

/**
 * Answer Schema
 */
var GameHistorySchema = new Schema({
  gameID: { type: String, required: true },
  started: { type: Date, default: Date.now},
  ended: Boolean,
  rounds: Number,
  creator: String,
  winner: String,
  players: { type: Array },
});

// export model
module.exports = mongoose.model('GameHistory', GameHistorySchema);
