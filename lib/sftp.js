let Client = require('ssh2-sftp-client');
const fs = require('fs');
const p = require('path');
const {constants, helpers, log} = require('utils-nxg-cg');
const {objectSFTPOpt,objectSFTPReq} = require('./objects');

let sftp = new Client(); 

module.exports.sftp = async (msg, cfg, test = false) => {
    return new Promise(async (resolve, reject) => {
        try {
            log.info('Inside sftp lib');
            log.debug('Msg=', JSON.stringify(msg));
            log.debug('Config=', JSON.stringify(cfg));

            const {data} = msg;

            let properties = {...objectSFTPReq};
            let extraProp = {...objectSFTPOpt};

            if (!test && !data) {
                throw new Error(`${constants.ERROR_PROPERTY} data`);
            }
            const valid = await helpers.validProperties(properties, data, cfg);

            if (valid) {
                await helpers.validProperties(extraProp, data, cfg, true);
                properties = {​​​​​​...properties, ...extraProp}​​​​​​;

                if(properties.key){
                    connSettings={host: host,
                      port: port,
                      username: username,
                      privateKey: fs.readFileSync(key)
                    };
                  }
                  else{
                    connSettings={host: host,
                      port: port,
                      username: username,
                      password: password
                    };
                  }

                  const result  = await sftp.connect(connSettings)
                    .then(() => {
                      if(flag.toUpperCase()=="GETLISTFILES"){return sftp.list(path);}

                      else if (flagReq.toUpperCase()=="GETFILE"){ return sftp.get(pathReq.join(fileReq)).
                        then(r =>{return{filename:fileReq, content:r.toString('base64')};});}

                      else if (flag.toUpperCase()=="SAVEFILE"){return sftp.put(Buffer.from(content, "base64"), p.join(path, nameNewFile));}
                      else if (flag.toUpperCase()=="RENAMEFILE"){return sftp.rename(p.join(path, nameOldFile), p.join(path, nameNewFile));}
                      else if (flag.toUpperCase()=="DELETEFILE"){return sftp.delete(p.join(path, nameDeleteFile));}
                      else if (flag.toUpperCase()=="CREATEDIRECTORY"){return sftp.mkdir(p.join(path, createDirectory), true);}
                      else if (flag.toUpperCase()=="DELETEDIRECTORY"){return sftp.rmdir(p.join(path, deleteDirectory), true);}
                      else if (flag.toUpperCase()=="DOWNLOADIRECTORY"){return (sftp.downloadDir(path, localDirectory));//.to.eventually.equal(`${pathReq} downloaded to ${localDirectoryReq}`);
                      //then(r =>{return{status:'process finished'};});
                      }
                      else if (flag.toUpperCase()=="UPLOADIRECTORY"){return (sftp.uploadDir(localDirectory, path));}
                    });

                    resolve(result);

                    log.info(constants.SUCCESS_TRANS, result);
            }
        } catch (e) {
            log.error(e);
            reject(e);
        }
        finally{
            sftp.end();
        }
    });
};