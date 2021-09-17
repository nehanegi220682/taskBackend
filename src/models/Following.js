const { model, Schema } = require('mongoose');

const FollowingSchema = new Schema({
    follower: {
        type: Schema.ObjectId, ref: 'User',
        required: true,
        index: true
    },
    following: {
        type: Schema.ObjectId, ref: 'User',
        required: true,
        index: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

FollowingSchema.index({ follower: 1, following: 1 }, { unique: true });

const Following = model('following', FollowingSchema);

module.exports = Following;