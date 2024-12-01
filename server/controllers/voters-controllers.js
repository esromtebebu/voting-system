const { validationResult } = require('express-validator');
const dotenv = require('dotenv');

dotenv.config();

const HttpError = require('../models/http-error');
const Voters = require('../models/voters');
const votersServices = require('../services/voters-services');

export const createVoter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  };
  const { voterFirstName, voterLastName, voterRFID, voterDOB, voterImage } = await req.body;
  const voterName = {
      voterFirstName: voterFirstName,
      voterLastName: voterLastName
  };
  const elections = [];
  const createdVoter = new Voters({
      voterName,
      voterRFID,
      voterDOB,
      voterImage,
      elections
  });

  let newElector;
  try {
      newElector = await votersServices.newVoter(createdVoter);
  } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again.',
        500
      );
      throw next(error);
    };
  
    res.status(201).json({user: newElector.toObject({ getters: true })});
}

export const modifyVoter = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  };
  const { voterFirstName, voterLastName, voterRFID, voterDOB } = await req.body;
  const voterName = {
      voterFirstName: voterFirstName,
      voterLastName: voterLastName
  };

  const updatedVoter = new Voters({
      voterName,
      voterRFID,
      voterDOB
  });
  let updatedElector;
  try {
    updatedElector = await votersServices.updateVoter(updatedVoter);
  } catch (err) {
      const error = new HttpError(
        'Update failed, please try again.',
        500
      );
      throw next(error);
  };
  
    res.status(201).json({"Voter": updatedElector.toObject({ getters: true })});
}

export const registerToVote = async (req, res, next) => {
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
      throw next(error);
  };
  res.status(201).json({"Election": newElection});
}

export const castVote = async (req, res, next) => {
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
      throw next(error);
  };
  res.status(201).json({"Election": election});
}

export const getVoterRFID = async (req, res, next) => {
  let raspiRFID;
  try {
      raspiRFID = await votersServices.scanVoterRFID();

  } catch (err) {
      const error = new HttpError(
        'Getting RFID failed, please try again.',
        500
      );
      throw next(error);
    };
    res.status(200).json({"VoterRFID": raspiRFID});
}

export const getVoterImage = async (req, res, next) => {
  let raspiImage;
  try {
      raspiImage = await votersServices.takeVoterImage();
  } catch (err) {
      const error = new HttpError(
        'Getting Image failed, please try again.',
        500
      );
      throw next(error);
    };
    res.status(200).json({"VoterImage": raspiImage});
}

export const checkVoterIdentityByImage = async (req, res, next) => {
  const voterRFID = await req.params.voterRFID;
  const newImage = await getVoterImage();
  let result;
  try {
      result = await votersServices.verifyFace(voterRFID, newImage);
  } catch (err) {
      const error = new HttpError(
        'Face recognition of voter failed, please try again.',
        500
      );
      throw next(error);
    };
    res.status(200).json({result});
}

export const login = async (req, res, next) => {
  const { voterRFID, voterDOB } = await req.body;
  let existingVoter;
  try {
    existingVoter = await votersServices.findVoterById(voterRFID);
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    throw next(error);
  };

  if (!existingVoter || existingVoter.voterDOB !== voterDOB || existingVoter.voterRFID !== voterRFID) {
    const error = new HttpError(
      'Invalid credentials or voter. does not exist, could not log you in.',
      401
    );
    throw next(error);
  };

  res.status(200).json({message: 'Logged in!'});
}