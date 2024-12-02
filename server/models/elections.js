const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const electionSchema = new Schema({
    name: { type: String, required: true },
    electionId: { type: String, required: true },
    candidates: [
        {   
            candidateId: { type: String, required: true },
            primaryCandidate: {
                primaryCandidateFirstName: { type: String, required: true },
                primaryCandidateLastName: { type: String, required: true },
                primaryCandidateRole: { type: String, required: true }
            },
            secondaryCandidate: {
                secondaryCandidateFirstName: { type: String, required: true },
                secondaryCandidateLastName: { type: String, required: true },
                secondaryCandidateRole: { type: String, required: true }
            },
            party: { type: String, required: true},
            votes: { type: Number, default: 0 }
        }
    ],
    electionDates: {
        registrationStart: { type: Date, required: true },
        registrationEnd: { type: Date, required: true },
        votingStart: { type: Date, required: true },
        votingEnd: { type: Date, required: true }
    }
});

module.exports = mongoose.model('Elections', electionSchema);