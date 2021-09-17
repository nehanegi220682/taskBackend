`use strict`;

const express = require('express');
const routerUnprotected = express.Router();
const protectedRouter = express.Router();
const { handelHTTPEndpointError } = require('../../utils/errorHandler');
const { createUser, getUser, getUsersList, getFeed } = require('../controllers/userController');


protectedRouter.get('/feed', async (req, res) => {
    try {
        let feed = await getFeed(req.user.id);
        return res.json(feed);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});


protectedRouter.get('/:userID', async (req, res) => {
    try {
        let userInfo = await getUser(req.params.userID);
        return res.json(userInfo);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

routerUnprotected.post('/', async (req, res) => {
    try {
        const user = req.body;
        await createUser(user);
        return res.send('user created');
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

protectedRouter.get('/', async (req, res) => {
    try {
        let usersList = await getUsersList(req.user.id);
        return res.json(usersList);
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    routerUnprotected,
    protectedRouter
};
