const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const sshSchema = new Schema ({
    host           : {type: String, index: {unique: true, dropDups: true}},
    username        : String,
    privateKey            : String
});

module.exports.sshKeyCollection = mongoose.model('ssh', sshSchema);