const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Elections = require('../models/elections');
const electionsServices = require('../services/elections-services');

const newElection = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return next(
  //     new HttpError('Invalid inputs passed, please check your data.', 422)
  //   );
  // };
  const { name, electionId, registrationStart, registrationEnd, votingStart, votingEnd } = await req.body;
  const electionDates = {
    registrationStart: registrationStart,
    registrationEnd: registrationEnd,
    votingStart: votingStart,
    votingEnd: votingEnd
  };
  const candidates = [];
  const createdElection = new Elections({
    name: name,
    electionId: electionId,
    candidates: candidates,
    electionDates: electionDates
  });
  let newCampaign;
  try {
      newCampaign = await electionsServices.createElection(createdElection);
  } catch (err) {
      const error = new HttpError(
        'Creating new election failed, please try again.',
        500
      );
      return res.status(error.code).json({ message: error.message});
    };
  
    res.status(201).json({election: newCampaign.toObject({ getters: true })});
}

const getAllElections = async (req, res, next) => {
    let elections;
    try {
      elections = await electionsServices.getElections();
    } catch (err) {
      const error = new HttpError(
        'Fetching elections failed, please try again later.',
        500
      );
      return res.status(error.code).json({ message: error.message});
    }
    res.json(elections.map(election => election.toObject({ getters: true })));
}

const findById = async (req, res, next) => {
    const {electionId} = await req.params.electionId;
    let election;
    try {
      election = await electionsServices.getElectionById(electionId);
    } catch (err) {
      const error = new HttpError(
        'Fetching election failed, please try again later.',
        500
      );
      return res.status(error.code).json({ message: error.message});
    }
    res.status(200).json({election});
}

const modifyElection = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  };
  const electionId = await req.params.electionId;
  const { name, registrationStart, registrationEnd, votingStart, votingEnd } = await req.body;
  const electionDates = {
    registrationStart: registrationStart,
    registrationEnd: registrationEnd,
    votingStart: votingStart,
    votingEnd: votingEnd
  };
  const updatedElection = new Elections({
    name,
    electionDates
  });
  let updatedCampaign;
  try {
    updatedCampaign = await electionsServices.updateElection(electionId, updatedElection);
  } catch (err) {
      const error = new HttpError(
        'Updating election failed, please try again.',
        500
      );
      return res.status(error.code).json({ message: error.message});
    };
  
    res.status(201).json({election: updatedCampaign.toObject({ getters: true })});
}

const addCandidate = async (req, res, next) => {
  const electionId = await req.params.electionId;
  const { candidateId, primaryCandidateFirstName, primaryCandidateLastName, primaryCandidateRole, secondaryCandidateFirstName, secondaryCandidateLastName, secondaryCandidateRole, party } = await req.body;
  const primaryCandidate = {
    primaryCandidateFirstName: primaryCandidateFirstName,
    primaryCandidateLastName: primaryCandidateLastName,
    primaryCandidateRole: primaryCandidateRole
  };
  const secondaryCandidate = {
      secondaryCandidateFirstName: secondaryCandidateFirstName,
      secondaryCandidateLastName: secondaryCandidateLastName,
      secondaryCandidateRole: secondaryCandidateRole
  };
  const candidate = {
    candidateId: candidateId,
    primaryCandidate: primaryCandidate,
    secondaryCandidate: secondaryCandidate,
    party: party
  };
  let addedCandidate;
  try {
    addedCandidate = await electionsServices.newCandidate(electionId, candidate);
  } catch (err) {
    const error = new HttpError(
      'Adding new candidate failed, please try again.',
      500
    );
    return res.status(error.code).json({ message: error.message});
  };

  res.status(201).json({candidate: addedCandidate});
}

const addVote = async (req, res, next) => {
  const electionId = await req.params.electionId;
  const candidateId = await req.body.candidateId;
  let addedVote;
  try {
    addedVote = await electionsServices.newVote(electionId, candidateId);
  } catch (err) {
    const error = new HttpError(
      'Adding new candidate failed, please try again.',
      500
    );
    return res.status(error.code).json({ message: error.message});
  };

  res.status(201).json({newVote: addedVote});
}

module.exports = { newElection, getAllElections, findById, modifyElection, addCandidate, addVote };