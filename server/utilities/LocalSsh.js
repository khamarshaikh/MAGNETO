const fs = require('fs');
const path = require('path');
const node_ssh = require('node-ssh');
const ssh = new node_ssh();



class LocalSsh {

    constructor(host,username,privateKey){
        this.conn = this.getConnection(host,username,privateKey);
    }

    getConnection(host,username,privateKey){
        return ssh.connect({
            host,
            username,
            privateKey,

        })
    }

    executeCommand(command,cwd) {
        return new Promise((resolve, reject) => {
            ssh.execCommand(command, { cwd })
                .then(function(result) {
                    // if (result.stderr !== "")
                    //     reject('STDERR: ' + result.stderr);
                    resolve(result.stdout);
                })
        });
    }

    putFile(localfs, remotefs){
        return new Promise((resolve,reject) => {
            ssh.putFile(localfs, remotefs).then(function() {
                console.log("The File thing is done");
                resolve();
            }, function(error) {
                console.log("Something's wrong");
                reject(error);
            })
        })
    }

    getFile(remotefs,localfs){
        return new Promise((resolve,reject) => {
            ssh.getFile(localfs, remotefs).then(function() {
                console.log("The File thing is done");
                resolve();
            }, function(error) {
                console.log("Something's wrong");
                reject(error);
            })
        })
    }

    putDirectory(localfs,remotefs){
        return new Promise((resolve,reject) => {
            ssh.putDirectory(localfs,remotefs, {
                recursive: true,
                concurrency: 10,
                tick: function(localPath, remotePath, error) {
                    if (error) {
                        failed.push(localPath)
                    } else {
                        successful.push(localPath)
                    }
                }
            }).then(function(status) {
                if(status)resolve();
                else reject();
                console.log('the directory transfer was', status ? 'successful' : 'unsuccessful');
            })
        });

    }


}

module.exports = new LocalSsh("localhost","aniruaga","/Users/aniruaga/.ssh/id_rsa");
