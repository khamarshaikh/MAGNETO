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

        return new Promise((resolve,reject) => {

            this.hdfs.readdir(hdfsPath,(err,list) => {
            list.forEach(file => {
                let lfsStream = fs.createWriteStream(lfsPath + file.pathSuffix);
                let hdfsStream = this.hdfs.createReadStream(hdfsPath + '/' + file.pathSuffix);
                hdfsStream.pipe(lfsStream);

                    hdfsStream.on("error", function onError (err) {
                        console.log("error", err);
                        reject(err);
                    });
                    hdfsStream.on("finish", function onFinish () {
                        resolve("Upload is done");
                    });
                });
            });

        });


    }

}

module.exports = WebHdfs;