const dotenv = require('dotenv');

dotenv.config();

const Voters = require('../models/voters');
const raspiIP = process.env.RASPIIP;
const face_recognition_server = process.env.FACE_RECOGNIZER;

const newVoter = async (voterObject) => {
    try {
        const voter = new Voters(voterObject);
        console.log("Successfully created new voter.");
        return await voter.save();
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const updateVoter = async (voterRFID, updatedVoterData) => {
    try {
        const updatedVoter = await Voters.findOneAndUpdate(
            {voterRFID},
            {$set: {
                voterName: {
                    voterFirstName: updatedVoterData.voterName.voterFirstName,
                    voterLastName: updatedVoterData.voterName.voterLastName
                },
                voterRFID: updatedVoterData.newVoterRFID,
                voterDOB: updatedVoterData.voterDOB,
                voterImage: updatedVoterData.voterImage
            }}
        );
        console.log("Successfully updated voter.");
        return updatedVoter;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const registerVoter = async (voterRFID, electionId) => {
    try {

        const newElection = {
            electionId: electionId,
            voterStatus: "registered"
        };

        console.log("Voter registered for new election.");
        return await Voters.findOneAndUpdate({ voterRFID: voterRFID }, { $push: {elections: newElection}});
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const vote = async (voterRFID, electionId) => {
    try { 
        console.log("Voter voted successfully.");
        return await Voters.updateOne(
            { 
              voterRFID: voterRFID,
              "elections.electionId": electionId
            },
            { $set: { "elections.$.voterStatus": "voted" } }
        );
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const scanVoterRFID = async () => {
    try {
        let raspiRFID = await fetch(`http://${raspiIP}:5000/scan`);
        raspiRFID = await raspiRFID.json();
        console.log("Successfully scanned RFID.", raspiRFID);
        return raspiRFID["RFID"];
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const verifyFace = async (voterRFID, newImage) => {
    try {
        const voterImage = await Voters.findOne(
            { voterRFID: voterRFID},
            { voterImage: 1}
        );
        let results = await fetch(
                                        `${face_recognition_server}`, 
                                        {
                                            method: 'POST', 
                                            headers: {
                                            'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                                face_a: newImage,
                                                face_b: voterImage.voterImage
                                            })
                                        }
                                    );
        results = await results.json();
        console.log("Facial verification run successfully.");
        return results["verified"];
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const takeVoterImage = async () => {
    try {
        let raspiImage = await fetch(`http://${raspiIP}:5000/capture`);
        raspiImage = await raspiImage.json();
        console.log("Successfully captured image.");
        return raspiImage["Face"];
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const signIn = async (voterRFID, voterDOB) => {
    try {
        const voter = await Voters.findOne({ voterRFID: voterRFID, voterDOB: voterDOB });
        console.log("Successfully signed in.");
        return voter;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

const findOneByRFID = async (voterRFID) => {
    try {
        const voter = await Voters.findOne({ voterRFID: voterRFID });
        console.log("Voter found.");
        return voter;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

module.exports = { newVoter, updateVoter, registerVoter, vote, scanVoterRFID, verifyFace, takeVoterImage, signIn, findOneByRFID };