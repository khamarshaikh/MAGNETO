const fs = require('fs');


class Fs{

    getFilesFromFolder(testFolder){
        let allfiles = [];
        return new Promise((resolve,reject) => {
            console.log("here")
            fs.readdir(testFolder, (err, files) => {
                if(err){
                    console.log(err);
                    reject("err");
                }
                else {
                    files.forEach(file => {
                        allfiles.push(file);
                    });
                    resolve(allfiles);
                }
            });
        })
    }
}

module.exports = new Fs();