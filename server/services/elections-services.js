const Elections = require('../models/elections');

export const getElectionById = async (electionId) => {
    try {
        const election = await Elections.findOne(electionId);
        return election;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const getElections = async () => {
    try {
        const elections = await Elections.find();
        return elections;
    } catch (err) {
        console.error(err);
        throw new Error(err);        
    }
}

export const createElection = async (electionObject) => {
    try {
        const newElection = new Elections(electionObject);
        return await newElection.save();
    } catch (err) {
        console.error(err);
        throw new Error(err);        
    }
}

export const updateElection = async (electionId, updatedElectionData) => {
    try {
        const updatedElection = await Elections.findOneAndUpdate(
            electionId,
            updatedElectionData,
            { new: true }
        );
        console.log("Successfully updated election.");
        return updatedElection;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const newVote = async (electionId, candidateId) => {
    try {
        const updatedElection = await Elections.findOneAndUpdate(
            { 
                electionId: electionId,
                "candidates.candidateId": candidateId
            },   
            {$inc: { "candidates.$.votes": 1}}
        );
        console.log("Vote successfully counted.");
        return updatedElection;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}

export const newCandidate = async (electionId, candidateObject) => {
    try {
        const candidate = {
            candidateId: candidateObject.candidateId,
            primaryCandidate: {
                primaryCandidateFirstName: candidateObject.primaryCandidate.primaryCandidateFirstName,
                primaryCandidateLastName: candidateObject.primaryCandidate.primaryCandidateLastName,
                primaryCandidateRole: candidateObject.primaryCandidate.primaryCandidateRole
            },
            secondaryCandidate: {
                secondaryCandidateFirstName: candidateObject.secondaryCandidate.secondaryCandidateFirstName,
                secondaryCandidateLastName: candidateObject.secondaryCandidate.secondaryCandidateLastName,
                secondaryCandidateRole: candidateObject.secondaryCandidate.secondaryCandidateRole
            },
            party: candidateObject.party,
            votes: 0
        }
        const addedCandidate = await Elections.findByIdAndUpdate(
            {electionId: electionId},
            {$push: {candidates: candidate}}
        );
        console.log("Successfully added a new candidate.")
        return addedCandidate;
    } catch (err) {
        console.error(err);
        throw new Error(err);
    }
}