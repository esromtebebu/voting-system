const { ObjectId } = require('mongodb');
const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const voterSchema = new Schema({
    voterName: {
        voterFirstName: { type: String, required: true },
        voterFirstMiddleName: { type: String, required: false },
        voterSecondMiddleName: { type: String, required: false },
        voterThirdMiddleName: { type: String, required: false },
        voterLastName: { type: String, required: true },
    },
    voterRFID: { type: ObjectId, required: true },
    voterDOB: { type: Date, required: true },
    voterImage: { type: String, required: true },
    elections: [
        {
            electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Elections', required: true },
            voterStatus: { type: String, require: true }
        }
    ]
});

voterSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Voters', voterSchema);


