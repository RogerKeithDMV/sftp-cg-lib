/**
 * Object who contains the required properties of the sftp component.
 */
 const objectSFTPReq = {
    host:null,
    port:null,
    username:null,
    path:null
};

/**
 * Object who contains the optionals properties of the sftp component.
 */

const objectSFTPOpt = {
    password:null,
    key:null,
    flag:null,
    path:null,
    file:null,
    content:null,
    nameNewFile:null,
    nameOldFile:null,
    nameDeleteFile:null,
    createDirectory:null,
    deleteDirectory:null,
    localDirectory:null
};

module.exports = {
    objectSFTPReq,
    objectSFTPOpt
}