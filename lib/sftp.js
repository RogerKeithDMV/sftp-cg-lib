const fs = require('fs');
const p = require('path');
let Client = require('ssh2-sftp-client');
const {constants, helpers} = require('utils-nxg-cg');
const {objectSFTPOpt, objectSFTPReq} = require('./objects');
const {flags} = constants;

let sftp = new Client();

/**
 * Method that process sftp operations
 * @param msg
 * @param cfg
 * @param test
 * @returns {Promise<unknown>}
 */
const process = async (msg, cfg, test = false) => {
    try {
        const {data} = msg;

        let properties = {...objectSFTPReq};
        let extraProp = {...objectSFTPOpt};

        if (!test && !data) {
            throw Error(`${constants.ERROR_PROPERTY} data`);
        }
        const valid = helpers.validProperties(properties, data, cfg);

        if (valid) {
            helpers.validProperties(extraProp, data, cfg, true);
            properties = {...properties, ...extraProp};

            let connSettings = {
                host: properties.host,
                port: properties.port,
                username: properties.username,
            };
            if (properties.key)
                connSettings.privateKey = fs.readFileSync(properties.key, 'utf8');
            else
                connSettings.password = properties.password;

            let encoding = 'base64';
            if (properties.encoding) encoding = properties.encoding;
            properties.flag = properties.flag.toUpperCase();

            const validProp = await validProperties(properties);
            if (validProp) {
                const result = await sftp.connect(connSettings)
                    .then(async () => {
                        switch (properties.flag) {
                            case 'CREATEDIRECTORY':
                                return sftp.mkdir(p.join(properties.path, properties.nameDirectory), true);
                            case 'DELETEDIRECTORY':
                                return sftp.rmdir(p.join(properties.path, properties.nameDirectory), true);
                            case 'DELETEFILE':
                                return sftp.delete(p.join(properties.path, properties.file));
                            case 'DOWNLOADIRECTORY':
                                return (sftp.downloadDir(properties.path, properties.nameDirectory, undefined));//.to.eventually.equal(`${pathReq} downloaded to ${localDirectoryReq}`);
                            case 'GETFILE':
                                return Buffer.from(await sftp.get(p.join(properties.path, properties.file), undefined)).toString(encoding);
                            case 'GETLISTFILES':
                                return sftp.list(properties.path);
                            case 'RENAMEFILE':
                                return sftp.rename(p.join(properties.path, properties.file), p.join(properties.path, properties.nameNewFile));
                            case 'SAVEFILE':
                                return sftp.put(Buffer.from(properties.content, encoding), p.join(properties.path, properties.file));
                            case 'UPLOADIRECTORY':
                                return (sftp.uploadDir(properties.nameDirectory, properties.path, undefined));
                            default:
                                throw Error(`Option ${properties.flag} not exists`);
                        }
                    });
                if (properties.flag === flags.GETLISTFILES)
                    if (!helpers.isObjectValid(result))
                        throw Error(constants.ERROR_JSON_FORMAT);
                return {result, flag: properties.flag};
            }
        }
    } catch (e) {
        throw Error(e.toString());
    } finally {
        await sftp.end();
    }
};

/**
 * Method for valid properties
 * Custom validations for each process
 * @param properties
 * @returns {Promise<boolean>}
 */
const validProperties = async (properties) => {
    switch (properties.flag) {
        case 'DELETEFILE':
        case 'GETFILE':
            if (!properties.file)
                throw Error(`${constants.ERROR_PROPERTY} file`);
            break;
        case 'SAVEFILE':
            if (!properties.content || !properties.file)
                throw Error(`${constants.ERROR_PROPERTY} content and file`);
            break;
        case 'RENAMEFILE':
            if (!properties.nameNewFile || !properties.file)
                throw Error(`${constants.ERROR_PROPERTY} file and nameNewFile`);
            break;
        case 'CREATEDIRECTORY':
        case 'DELETEDIRECTORY':
        case 'DOWNLOADIRECTORY':
        case 'UPLOADIRECTORY':
            if (!properties.nameDirectory)
                throw Error(`${constants.ERROR_PROPERTY} nameDirectory`);
            break;
    }
    return true;
};

module.exports = {
    sftp: process
};