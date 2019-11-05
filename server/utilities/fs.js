const fs = require('fs');


class Fs{

    getFilesFromFolder(testFolder){
        let allfiles = [];
        return new Promise((accepts,reject) => {
            fs.readdir(testFolder, (err, files) => {
                if(err)reject("err");
                else {
                    files.forEach(file => {
                        allfiles.push(file);
                        console.log(file);
                    });
                    accepts(allfiles);
                }
            });
        })
    }
}

module.exports = new Fs();