`use strict`;
const { v4 } = require('uuid');
const crypto = require('crypto');
const UserModel = require('../models/User');
const { listPosts } = require('../controllers/postController');
const { listFollowing } = require('../controllers/followingController');


const createUser = async (user) => {
    try {
        await _validateUser(user);
        let serializedUser = _serializeUser(user);
        await _saveUser(serializedUser);
    } catch (err) {
        throw err
    }
}

const getUser = async (userId) => {
    try {
        let user = await UserModel.findOne({ _id: userId }, { _id: 1, name: 1, email: 1, created: 1, modified: 1 });
        if (!user) throw { customMessage: 'user not found' };
        user = user.toJSON();
        return user;
    } catch (err) {
        throw err
    }
}

const _validateUser = async (user) => {
    try {
        if (!(user && Object.keys(user).length))
            throw { customMessage: 'Users is required in body' };
        if (!(user.name && user.name.length))
            throw { customMessage: 'Users Name is a required field' };
        if (!(user.email && user.email.length))
            throw { customMessage: 'Email is a required field' };
        if (!_validateEmail(user.email))
            throw { customMessage: 'Not a valid email Address' };
        if (!(user.password && user.password.length))
            throw { customMessage: 'Password is a required field' };
        if (!_validatePassword(user.password))
            throw { customMessage: 'Password should contain at least 1 lowercase 1 uppercase 1 numeric 1 special and 8 in total characters' };
        if (user.phone && !_validatePhoneNumber(user.phone))
            throw { customMessage: 'Invalid Phone No (Valid entry 10 digits without country code )' };
    } catch (err) {
        throw err;
    }
}

const _serializeUser = (user) => {
    try {
        user.salt = v4();
        user.password = crypto.pbkdf2Sync(user.password, user.salt, 10000, 64, 'sha512').toString('hex');
        return user;
    } catch (err) { throw err }
}

const _validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const _validatePhoneNumber = (phone) => {
    return phone.match(/^\d{10}$/g);
}

const _validatePassword = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    return strongRegex.test(password);
}

const _saveUser = async (serializedUser) => {
    try {
        let user = new UserModel(serializedUser);
        await user.save();
    } catch (err) {
        if (err.message && err.message.includes('E11000')) err.customMessage = 'Email is already registered';
        throw err;
    }
}


const getUsersList = async (userId) => {
    try {
        let users = await UserModel.find({ _id: { $ne: userId } }, { _id: 1, name: 1, email: 1 });
        if (!users) throw { customMessage: 'users not found' };
        let following = await listFollowing(userId);
        following = _generateObjMap(following);
        users = users.map(user => {
            user = user.toJSON();
            user._id = user._id.toJSON();
            if (following.hasOwnProperty(user._id))
                user.isFollowing = true;
            else
                user.isFollowing = false;
            return user;
        });
        return users;
    } catch (err) { throw err }
}

const _generateObjMap = (following) => {
    const map = {};
    following.forEach(val => {
        val = val.toJSON();
        val = val.following.toJSON();
        if (!map.hasOwnProperty(val))
            map[val] = true;
    });
    return map;
}

const getFeed = async (userID) => {
    try {
        let following = await listFollowing(userID);
        following = following.map(item => {
            item = item.toJSON();
            return item.following.toJSON();
        });
        following.push(userID);
        const posts = await listPosts(following);
        return posts;
    } catch (err) { throw err }
}

module.exports = {
    getUsersList,
    createUser,
    getUser,
    getFeed
}