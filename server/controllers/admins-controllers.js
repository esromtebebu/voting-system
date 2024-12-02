const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Admins = require('../models/admins');
const adminsServices= require('../services/admins-services');

const createAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    };
    const { adminFirstName, adminLastName, adminRFID, adminDOB, adminImage } = await req.body;
    const adminName = {
        adminFirstName: adminFirstName,
        adminLastName: adminLastName
    };
    const createdAdmin = new Admins({
        adminName,
        adminRFID,
        adminImage,
        adminDOB
    });
    let newAdministrator;
    try {
        newAdministrator = await adminsServices.newAdmin(createdAdmin);
    } catch (err) {
        const error = new HttpError(
          'Signing up failed, please try again.',
          500
        );
        throw next(error);
      };
    
      res.status(201).json({user: newAdministrator.toObject({ getters: true })});
}

const modifyAdmin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    };
    const adminRFID = await req.params.adminRFID;
    const { adminFirstName, adminLastName, newAdminRFID, adminDOB } = await req.body;
    const adminName = {
        adminFirstName: adminFirstName,
        adminLastName: adminLastName
    };

    const updatedAdmin = new Admins({
        adminName,
        adminRFID,
        adminDOB
    });
    let updatedAdministrator;
    try {
        updatedAdministrator = await adminsServices.updateAdmin(adminRFID, updatedAdmin);
    } catch (err) {
        const error = new HttpError(
          'Update failed, please try again.',
          500
        );
        throw next(error);
    };
    
      res.status(201).json({"Admin": updatedAdministrator.toObject({ getters: true })});
}

const getAdminRFID = async (req, res, next) => {
    let raspiRFID;
    try {
        raspiRFID = await adminsServices.scanAdminRFID();

    } catch (err) {
        const error = new HttpError(
          'Getting RFID failed, please try again.',
          500
        );
        throw next(error);
      };
      res.status(200).json({"AdminRFID": raspiRFID});
}

const getAdminImage = async (req, res, next) => {
    let raspiImage;
    try {
        raspiImage = await adminsServices.takeAdminImage();
    } catch (err) {
        const error = new HttpError(
          'Getting Image failed, please try again.',
          500
        );
        throw next(error);
      };
      res.status(200).json({"AdminImage": raspiImage});
}

const getAdminById = async (req, res, next) => {
    const adminRFID = await req.params.adminRFID;
    let admin;
    try {
        admin = await adminsServices.findAdminById(adminRFID);
    } catch (err) {
        const error = new HttpError(
          'Getting admin failed, please try again.',
          500
        );
        throw next(error);
      };
      res.status(200).json({"Admin": admin});
}

const removeAdmin = async (req, res, next) => {
    const adminRFID = await req.params.adminRFID;
    let removedAdmin;
    try {
        removedAdmin = await adminsServices.deleteAdmin(adminRFID);
    } catch (err) {
        const error = new HttpError(
          'Deleting admin failed, please try again.',
          500
        );
        throw next(error);
      };
      res.status(200).json({"Message": "Deleted one admin. account."});
}

const checkAdminIdentityByImage = async (req, res, next) => {
    const adminRFID = await req.params.adminRFID;
    const newImage = await getAdminImage();
    let result;
    try {
        result = await adminsServices.verifyFace(adminRFID, newImage);
    } catch (err) {
        const error = new HttpError(
          'Face recognition of admin failed, please try again.',
          500
        );
        throw next(error);
      };
      res.status(200).json({result});
}

const login = async (req, res, next) => {
  const { adminRFID, adminDOB } = await req.body;
  let existingAdmin;
  try {
    existingAdmin = await adminsServices.findAdminById(adminRFID);
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    throw next(error);
  };

  if (!existingAdmin || existingAdmin.adminDOB !== adminDOB || existingAdmin.adminRFID !== adminRFID) {
    const error = new HttpError(
      'Invalid credentials or admin. does not exist, could not log you in.',
      401
    );
    throw next(error);
  };

  res.status(200).json({message: 'Logged in!'});
}

module.exports = { createAdmin, modifyAdmin, getAdminRFID, getAdminImage, getAdminById, removeAdmin, checkAdminIdentityByImage, login };