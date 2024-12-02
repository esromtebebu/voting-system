const { validationResult } = require('express-validator');
const dotenv = require('dotenv');

dotenv.config();

const HttpError = require('../models/http-error');
const Voters = require('../models/voters');
const votersServices = require('../services/voters-services');

const createVoter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  };
  const { voterFirstName, voterLastName, voterDOB, voterRFID, voterImage } = await req.body;
  const voterName = {
      voterFirstName: voterFirstName,
      voterLastName: voterLastName
  };
  const elections = [];
  const createdVoter = new Voters({
      voterName: voterName,
      voterRFID: voterRFID,
      voterDOB: voterDOB,
      voterImage: voterImage,
      elections: elections
  });

  let newElector;
  try {
      newElector = await votersServices.newVoter(createdVoter);
  } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again.',
        500
      );
      return res.status(error.code).json({ message: error.message});
    };
  
    res.status(201).json({user: newElector.toObject({ getters: true })});
}

const modifyVoter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  };
  const voterRFID = await req.params.voterRFID;
  const { voterFirstName, voterLastName, newVoterRFID, voterDOB, voterImage } = await req.body;
  const voterName = {
      voterFirstName: voterFirstName,
      voterLastName: voterLastName
  };

  const updatedVoter = new Voters({
      voterName: voterName,
      voterRFID: newVoterRFID,
      voterDOB: voterDOB,
      voterImage: voterImage
  });
  let updatedElector;
  try {
    updatedElector = await votersServices.updateVoter(voterRFID, updatedVoter);
  } catch (err) {
      const error = new HttpError(
        'Update failed, please try again.',
        500
      );
      return res.status(error.code).json({ message: error.message});
  };
  
    res.status(201).json({"Voter": updatedElector.toObject({ getters: true })});
}

const registerToVote = async (req, res, next) => {
  const voterRFID = await req.params.voterRFID;
  const electionId = await req.body.electionId;
  let newElection;
  try {
    newElection = await votersServices.registerVoter(voterRFID, electionId);
  } catch (err) {
      const error = new HttpError(
        'Registration failed, please try again.',
        500
      );
      return res.status(error.code).json({ message: error.message});
  };
  res.status(201).json({"Election": newElection});
}

const castVote = async (req, res, next) => {
  const voterRFID = await req.params.voterRFID;
  const electionId = await req.body.electionId;
  let election;
  try {
    election = await votersServices.vote(voterRFID, electionId);
  } catch (err) {
      const error = new HttpError(
        'Voting failed, please try again.',
        500
      );
      return res.status(error.code).json({ message: error.message});
  };
  res.status(201).json({"Election": election});
}

const getVoterRFID = async (req, res, next) => {
  let raspiRFID;
  try {
      raspiRFID = await votersServices.scanVoterRFID();

  } catch (err) {
      const error = new HttpError(
        'Getting RFID failed, please try again.',
        500
      );
      return res.status(error.code).json({ message: error.message});
    };
    res.status(200).json({"VoterRFID": raspiRFID});
}

const getVoterImage = async (req, res, next) => {
  let raspiImage;
  try {
      raspiImage = await votersServices.takeVoterImage();
  } catch (err) {
      const error = new HttpError(
        'Getting Image failed, please try again.',
        500
      );
      return res.status(error.code).json({ message: error.message});
    };
    res.status(200).json({"VoterImage": raspiImage});
}

const checkVoterIdentityByImage = async (req, res, next) => {
  const voterRFID = await req.params.voterRFID;
  const newImage = await votersServices.takeVoterImage();
  let result;
  try {
      result = await votersServices.verifyFace(voterRFID, newImage);
  } catch (err) {
      const error = new HttpError(
        'Face recognition of voter failed, please try again.',
        500
      );
      return res.status(error.code).json({ message: error.message});
    };
    res.status(201).json({"Verdict": result});
}

const login = async (req, res, next) => {
  let { voterRFID, voterDOB } = await req.body;
  voterDOB = new Date(voterDOB + 'T00:00:00.000+00:00');
  let existingVoter;
  try {
    existingVoter = await votersServices.findOneByRFID(voterRFID);
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return res.status(error.code).json({ message: error.message});
  }

  if (!existingVoter) {
    const error = new HttpError(
      'Voter not found, please check your credentials.',
      401
    );
    return res.status(error.code).json({ message: error.message});
  }

  if (existingVoter.voterDOB.getTime() !== voterDOB.getTime() || existingVoter.voterRFID !== voterRFID) {
    const error = new HttpError(
      'Invalid credentials or voter does not exist, could not log you in.',
      401
    );
    return res.status(error.code).json({ message: error.message});
  }

  res.status(200).json({ message: 'Logged in!' });
};


module.exports = { createVoter, modifyVoter, registerToVote, castVote, getVoterRFID, getVoterImage, checkVoterIdentityByImage, login };