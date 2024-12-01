const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Elections = require('../models/elections');
const electionsServices = require('../services/elections-services');

export const newElection = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  };
  const { name, registrationStart, registrationEnd, votingStart, votingEnd } = await req.body;
  const electionDates = {
    registrationStart: registrationStart,
    registrationEnd: registrationEnd,
    votingStart: votingStart,
    votingEnd: votingEnd
  };
  const candidates = [];
  const createdElection = new Elections({
    name,
    candidates,
    electionDates
  });
  let newCampaign;
  try {
      newCampaign = await electionsServices.createElection(createdElection);
  } catch (err) {
      const error = new HttpError(
        'Creating new election failed, please try again.',
        500
      );
      throw next(error);
    };
  
    res.status(201).json({election: newCampaign.toObject({ getters: true })});
}

export const getAllElections = async (req, res, next) => {
    let elections;
    try {
      elections = await electionsServices.getElections();
    } catch (err) {
      const error = new HttpError(
        'Fetching elections failed, please try again later.',
        500
      );
      throw next(error);
    }
    res.json({elections: elections.map(election => election.toObject({ getters: true }))});
}

export const findById = async (req, res, next) => {
    const {electionId} = await req.params.electionId;
    let election;
    try {
      election = await electionsServices.getElectionById(electionId);
    } catch (err) {
      const error = new HttpError(
        'Fetching election failed, please try again later.',
        500
      );
      throw next(error);
    }
    res.json({election: election.toObject({ getters: true })});
}

export const modifyElection = async (req, res, next) => {
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
      throw next(error);
    };
  
    res.status(201).json({election: updatedCampaign.toObject({ getters: true })});
}

export const addCandidate = async (req, res, next) => {
  const electionId = await req.params.electionId;
  const { primaryCandidateFirstName, primaryCandidateLastName, primaryCandidateRole, secondaryCandidateFirstName, secondaryCandidateLastName, secondaryCandidateRole, party } = await req.body;
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
    throw next(error);
  };

  res.status(201).json({candidate: addedCandidate});
}

export const addVote = async (req, res, next) => {
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
    throw next(error);
  };

  res.status(201).json({newVote: addedVote});
}