const {sftp} = require('./sftp');
const objects = require('./objects');

module.exports = {
    sftp,
    ...objects
};