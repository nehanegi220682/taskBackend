`use strict`;

const PostModal = require('../models/Post');

const listPosts = async (userID) => {
    try {
        let posts = await PostModal.find({ userID: { $in: userID } })
            .populate({
                path: 'userID',
                select: { 'name': 1, 'email': 1 },
            }).sort({created: -1});
        if (!posts) throw { customMessage: 'No post found not found for user' }
        return posts;
    } catch (err) { throw err }
}

const createPost = async (userID, content) => {
    try {
        if (!content) throw { customMessage: 'Cant post empty content' };
        if (content.length > 280) throw { customMessage: 'Max post limit to 280 chars' };
        let post = new PostModal({
            userID: userID,
            content: content
        });
        await post.save();
    } catch (err) {
        if (err.message && err.message.includes('E11000')) err.customMessage = 'Already post the user';
        throw err;
    }
}

const deletePost = async (postID) => {
    try {
        if (!postID) throw { customMessage: 'postID is required in body' };
        const res = await PostModal.deleteOne({ _id: postID });
        if (res.deletedCount == 0) throw { customMessage: 'No entry for post found' };
    } catch (err) {
        throw err;
    }
}

const updatePost = async (postID, content) => {
    try {
        if (!postID) throw { customMessage: 'postID is required in body' };
        if (!content) throw { customMessage: 'content is required in body' };
        const res = await PostModal.findByIdAndUpdate(postID, { content: content });
    } catch (err) {
        throw err;
    }
}


module.exports = {
    listPosts,
    createPost,
    deletePost,
    updatePost
}