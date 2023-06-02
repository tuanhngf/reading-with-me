const _ = require('lodash');

const getInfo = ({ fields = [], object = {} }) => _.pick(object, fields);
const mergeObjects = (...objects) => Object.assign({}, ...objects);

module.exports = { getInfo, mergeObjects };
