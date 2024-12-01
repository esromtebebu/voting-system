const { ObjectId } = require('mongodb');
const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    adminName: {
        adminFirstName: { type: String, required: true },
        adminLastName: { type: String, required: true },
    },
    adminRFID: { type: ObjectId, required: true },
    adminImage: { type: String, required: true },
    adminDOB: { type: Date, required: true },
    permissions: [ createVoter, updateVoter, createElection, deleteElection, updateElection ]
});

adminSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Admins', adminSchema);