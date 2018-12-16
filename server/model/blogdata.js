const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const BlogData = new Schema({
    user_id: String, // user Id
    title: String,
    content: String,
    author_name: String,
    image_url: String,
    date: {type: Date, default: Date.now},
    isApproved: {type: Boolean, default: false},
    approvedBy: String  // admin Id
});

module.exports = mongoose.model('blog', BlogData);