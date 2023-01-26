/**
 * Object who contains the required properties of the sftp component.
 * @type {{path: null, flag: null, port: null, host: null, username: null}}
 */
const objectSFTPReq = {
    flag: null,
    host: null,
    path: null,
    port: null,
    username: null
};

/**
 * Object who contains the optionals properties of the sftp component.
 * @type {{nameNewFile: null, path: null, password: null, file: null, nameDirectory: null, encoding: null, content: null, key: null}}
 */
const objectSFTPOpt = {
    content: null,
    encoding: null,
    file: null,
    key: null,
    nameDirectory: null,
    nameNewFile: null,
    password: null
};

module.exports = {
    objectSFTPReq,
    objectSFTPOpt
}