//Database protocol model
const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const ProtocolSchema = new Schema({
//id: String,
casenr: Number,
pid: Number,
fid: Number,
name: String,
surname: String,
birthdate: Date,
diagnose: String,
operation: String,
isismodality: String,
opdate: Date,
description: String,
surgeon: String,
assistant: String,
entries : Object,
evaluation: Object,
baselines: Object,
extras: Object,
closing: Object,
},
{ typeKey: '$type' }
);



const Protocol = mongoose.model('Protocol', ProtocolSchema)
module.exports = Protocol;