`use strict`;

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { HTTP_STATUS_CODES, SECRET } = require('../../utils/constants');

const _isAuthenticated = async (req) => {
    try {
        let { user } = req.cookies;
        let decodeUser = jwt.verify(user, SECRET);
        req.user = decodeUser;
        return true;
    } catch (err) { return false; }
}

const isAuthenticatedRequest = async (req, res, next) => {
    try {
        if (await _isAuthenticated(req)) return next();
        else return res.status(HTTP_STATUS_CODES.UNAUTHORIZED).send('Unauthorized');
    } catch (err) {
        res.status(HTTP_STATUS_CODES.GENERIC_SERVER_ERROR).send('Something went wrong :(');
    }
}

const getAuthenticatedToken = async (data) => {
    try {
        let { email, password } = data;
        if (!email) throw { customMessage: 'Email is a required field' };
        if (!password) throw { customMessage: 'Password is a required field' }
        let secretData = await fetchUserFromDB(email);
        if (!validPassword(password, secretData)) throw { customMessage: 'Invalid email or Password' }
        const token = getToken(secretData);
        return {
            token,
            userData: secretData
        }
    } catch (err) {
        throw err
    }
}

const getToken = (userData) => {
    try {
        let token = jwt.sign({
            name: userData.name,
            email: userData.email,
            id: userData.id
        }, SECRET, { expiresIn: '1h' });
        return token;
    } catch (err) { throw err }
}

const fetchUserFromDB = async (email) => {
    try {
        let data = await User.findOne({ email: email });
        if (!data) throw { customMessage: 'Invalid email or Password' }
        return data;
    } catch (err) { throw err }
}

const validPassword = (customerPassword, secretData) => {
    try {
        hashedPassword = crypto.pbkdf2Sync(customerPassword, secretData.salt, 10000, 64, 'sha512').toString('hex');
        if (hashedPassword == secretData.password) return true;
        return false;
    } catch (err) { throw err }
}

module.exports = {
    isAuthenticatedRequest,
    getAuthenticatedToken
}