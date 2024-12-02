const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    adminName: {
        adminFirstName: { type: String, required: true },
        adminLastName: { type: String, required: true },
    },
    adminRFID: { type: String, required: true },
    adminImage: { type: String, required: true },
    adminDOB: { type: Date, required: true }
});

module.exports = mongoose.model('Admins', adminSchema);