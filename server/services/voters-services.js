const dotenv = require('dotenv');

dotenv.config();

const Voters = require('../models/voters');
const raspiIP = dotenv.RASPIIP;
const face_recognition_server = process.env.FACE_RECOGNIZER;

export const newVoter = async (voterObject) => {
    try {
        const voter = new Voters(voterObject);
        console.log("Successfully created new voter.");
        return await voter.save();
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const updateVoter = async (voterRFID, updatedVoterData) => {
    try {
        const updatedVoter = await Voters.findOneAndUpdate(
            voterRFID,
            updatedVoterData,
            { new: true }
        );
        console.log("Successfully updated voter.");
        return updatedVoter;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const registerVoter = async (voterRFID, electionId) => {
    try {

        const newElection = {
            electionId: electionId,
            voterStatus: "registered"
        };

        console.log("Voter registered for new election.");
        return await Voters.findOneAndUpdate({ voterRFID: voterRFID}, { $push: {elections: newElection}});
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const vote = async (voterRFID, electionId) => {
    try { 
        console.log("Voter voted successfully.");
        return await Voters.updateOne(
            { 
              voterRFID: voterRFID,
              "elections.electionID": electionId
            },
            { $set: { "elections.$.status": "voted" } }
        );
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const scanVoterRFID = async () => {
    try {
        const raspiRFID = await fetch(`http://${raspiIP}:5000/scan`)
                                    .then(response => response.json())
                                    .then(data => console.log(data))
                                    .catch(error => console.error(error));
        console.log("Successfully scanned RFID.");
        return raspiRFID;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const verifyFace = async (voterRFID, newImage) => {
    try {
        const voterImage = Voters.findOne(
            { voterRFID: voterRFID},
            { voterImage: 1}
        );
        const results = await fetch(
                                        `${face_recognition_server}`, 
                                        {
                                            method: 'POST',
                                            headers: {
                                            'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({
                                            face_a: newImage,
                                            face_b: voterImage
                                            })
                                    }
                                    )
                                        .then(response => response.json())
                                        .then(data => console.log(data)) 
                                        .catch(error => console.error(error))
                                    ;
        return results;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const takeVoterImage = async () => {
    try {
        const raspiImage = await fetch(`http://${raspiIP}:5000/capture`)
                                    .then(response => response.json())
                                    .then(data => console.log(data))
                                    .catch(error => console.error(error));
        console.log("Successfully captured image.");
        return raspiImage;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}