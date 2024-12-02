const express = require('express');
const { check } = require('express-validator');

const votersControllers = require('../controllers/voters-controllers');

const router = express.Router();

router.post('/create', votersControllers.createVoter);
router.patch('/:voterRFID/update', votersControllers.modifyVoter);
router.patch('/:voterRFID/register', votersControllers.registerToVote);
router.patch('/:voterRFID/vote', votersControllers.castVote);
router.get('/getRFID', votersControllers.getVoterRFID);
router.get('/capture', votersControllers.getVoterImage);
router.post('/:voterRFID/verify', votersControllers.checkVoterIdentityByImage);
router.post('/login', votersControllers.login);

module.exports = router;