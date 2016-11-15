/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../../config/config');
    Schema = mongoose.Schema,
    User = require('./user');

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
    title: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    user: [{type:mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

/**
 * Methods
 */
ArticleSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    save: function(plainText) {
        
    }
};

mongoose.model('Article', ArticleSchema);