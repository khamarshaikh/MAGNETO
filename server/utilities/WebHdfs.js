const WebHDFS = require('webhdfs');
const fs = require('fs');


class WebHdfs {

    constructor(user,host,port) {
        this.hdfs = this.createClient(user,host,port);
    }

    createClient(user,host,port) {
      return  WebHDFS.createClient({
            user, host, port,
            path: "/webhdfs/v1"
        });
    }

    getFolder(hdfsPath,lfsPath) {
        let lfsStream = fs.createWriteStream(lfsPath);
        let hdfsStream = this.hdfs.createReadStream(hdfsPath);
        hdfsStream.pipe(lfsStream);

        return new Promise((resolve,reject) => {
            remoteFileStream.on("error", function onError (err) {
                reject(err);
            });
            remoteFileStream.on("finish", function onFinish () {
                resolve("Upload is done");
            });
        });

    }

}

module.exports = WebHdfs;