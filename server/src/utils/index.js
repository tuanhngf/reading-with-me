const _ = require('lodash');

const getInfo = ({ fields = [], object = {} }) => _.pick(object, fields);
const mergeObjects = (...objects) => Object.assign({}, ...objects);

const asyncHandle = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = { getInfo, mergeObjects, asyncHandle };
