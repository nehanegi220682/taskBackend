`use strict`;

const express = require('express');
const protectedRouter = express.Router();
const { handelHTTPEndpointError } = require('../../utils/errorHandler');
const { createFollowing, deleteFollowing, listFollowing } = require('../controllers/followingController');

protectedRouter.post('/', async (req, res) => {
    try {
        await createFollowing(req.user.id, req.body.toFollowID);
        return res.send(`Added ${req.body.toFollowID} as following`);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

protectedRouter.delete('/', async (req, res) => {
    try {
        await deleteFollowing(req.user.id, req.body.toUnFollowID);
        return res.send(`Removed ${req.body.toUnFollowID} as following`);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

protectedRouter.get('/:userID', async (req, res) => {
    try {
        const following = await listFollowing(req.params.userID);
        return res.send(following);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    protectedRouter
};
