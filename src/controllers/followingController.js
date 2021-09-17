`use strict`;

const FollowingModal = require('../models/Following');
const UserModel = require('../models/User');

const listFollowing = async (userID) => {
    try {
        let following = await FollowingModal.find({ follower: userID }, { _id: 1, follower: 1, following: 1 });
        if (!following) throw { customMessage: 'No following found not found' }
        return following;
    } catch (err) { throw err }
}

const createFollowing = async (follower, toFollowID) => {
    try {
        if (!toFollowID) throw { customMessage: 'toFollowID is required in body' };
        if (follower == toFollowID) throw { customMessage: 'Following yourself not a valid operation' };
        const userExists = await UserModel.findOne({ _id: toFollowID }, { _id: 1 });
        if(!userExists) throw { customMessage: 'user to follow does not exists' };
        let following = new FollowingModal({
            follower, following: toFollowID
        });
        await following.save();
    } catch (err) {
        if (err.message && err.message.includes('E11000')) err.customMessage = 'Already following the user';
        throw err;
    }
}

const deleteFollowing = async (follower, following_id) => {
    try {
        if (!following_id) throw { customMessage: 'following_id is required in body' };
        const res = await FollowingModal.deleteOne({ follower: follower, following: following_id });
        if (res.deletedCount == 0) throw { customMessage: 'No entry found' };
    } catch (err) {
        throw err;
    }
}

module.exports = {
    listFollowing,
    createFollowing,
    deleteFollowing
}