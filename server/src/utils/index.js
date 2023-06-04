const _ = require('lodash');
const userModel = require('../models/user.model');

const getInfo = ({ fields = [], object = {} }) => _.pick(object, fields);
const mergeObjects = (...objects) => Object.assign({}, ...objects);

const asyncHandle = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const findByUsername = async ({
    username,
    select = {
        username: 1,
        name: 1,
        email: 1,
        mobile: 1,
        password: 1,
        roles: 1,
        saved: 1,
    },
}) => await userModel.findOne({ username }).select(select).lean();

module.exports = { getInfo, mergeObjects, asyncHandle, findByUsername };
