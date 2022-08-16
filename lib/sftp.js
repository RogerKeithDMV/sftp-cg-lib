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
                let connSettings;
                await helpers.validProperties(extraProp, data, cfg, true);
                properties = {...properties, ...extraProp};

                if(properties.key){
                    connSettings={host: properties.host,
                      port: properties.port,
                      username: properties.username,
                      privateKey: fs.readFileSync(properties.key, 'utf8')
                    };
                  }
                  else{
                    connSettings={host: properties.host,
                      port: properties.port,
                      username: properties.username,
                      password: properties.password
                    };
                  }
                  const result  = await sftp.connect(connSettings)
                    .then(() => {
                      if(properties.flag.toUpperCase()=="GETLISTFILES"){return sftp.list(properties.path);}

                      else if (properties.flag.toUpperCase()=="GETFILE"){ return sftp.get(properties.path + properties.file).
                        then(r =>{return{filename:properties.file, content:r.toString('base64')};});}

                      else if (properties.flag.toUpperCase()=="SAVEFILE"){return sftp.put(Buffer.from(properties.content, "base64"), p.join(properties.path, properties.nameNewFile));}
                      else if (properties.flag.toUpperCase()=="RENAMEFILE"){return sftp.rename(p.join(properties.path, properties.nameOldFile), p.join(properties.path, properties.nameNewFile));}
                      else if (properties.flag.toUpperCase()=="DELETEFILE"){return sftp.delete(p.join(properties.path, properties.nameDeleteFile));}
                      else if (properties.flag.toUpperCase()=="CREATEDIRECTORY"){return sftp.mkdir(p.join(properties.path, properties.createDirectory), true);}
                      else if (properties.flag.toUpperCase()=="DELETEDIRECTORY"){return sftp.rmdir(p.join(properties.path, properties.deleteDirectory), true);}
                      else if (properties.flag.toUpperCase()=="DOWNLOADIRECTORY"){return (sftp.downloadDir(properties.path, properties.localDirectory));//.to.eventually.equal(`${pathReq} downloaded to ${localDirectoryReq}`);
                      //then(r =>{return{status:'process finished'};});
                      }
                      else if (properties.flag.toUpperCase()=="UPLOADIRECTORY"){return (sftp.uploadDir(properties.localDirectory, properties.path));}
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