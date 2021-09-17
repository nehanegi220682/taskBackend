`use strict`;

const express = require('express');
const routerUnprotected = express.Router();
const { getAuthenticatedToken, isAuthenticatedRequest } = require('../controllers/authorizationController');
const { handelHTTPEndpointError } = require('../../utils/errorHandler');

routerUnprotected.post('/getToken', async (req, res) => {
    try {
        let { token, userData } = await getAuthenticatedToken(req.body);
        res.cookie('user', token, { httpOnly: true });
        return res.json({ name: userData.name, id: userData._id });
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

routerUnprotected.get('/status', isAuthenticatedRequest, (req, res) => {
    try {
        return res.send('Authenticated');
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

routerUnprotected.delete('/deleteToken', isAuthenticatedRequest, (req, res) => {
    try {
        res.cookie('user', 'expired', { httpOnly: true });
        res.status(401).send();
    } catch (err) {
        handelHTTPEndpointError(err, res);
    }
});

module.exports = {
    routerUnprotected
};
