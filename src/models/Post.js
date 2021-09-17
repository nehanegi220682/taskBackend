const { model, Schema } = require('mongoose');

const PostSchema = new Schema({
    userID: {
        type: Schema.ObjectId, ref: 'user',
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    }
});

const Post = model('post', PostSchema);

module.exports = Post;