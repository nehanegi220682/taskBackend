`use strict`;

const express = require('express');
const protectedRouter = express.Router();
const { handelHTTPEndpointError } = require('../../utils/errorHandler');
const { createPost, deletePost, listPosts, updatePost } = require('../controllers/postController');

protectedRouter.post('/', async (req, res) => {
    try {
        await createPost(req.user.id, req.body.content);
        return res.send(`Post published successfully`);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

protectedRouter.patch('/', async (req, res) => {
    try {
        await updatePost(req.body.postID, req.body.content);
        return res.send(`Post updated successfully`);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

protectedRouter.delete('/', async (req, res) => {
    try {
        await deletePost(req.body.postID);
        return res.send(`Post removed successfully`);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

protectedRouter.get('/:userID', async (req, res) => {
    try {
        const following = await listPosts([req.params.userID]);
        return res.send(following);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    protectedRouter
};
