const express = require('express');
const { check } = require('express-validator');

const votersControllers = require('../controllers/voters-controllers');

const router = express.Router();

router.get('/', votersControllers.getVoters);
router.get('/scan', votersControllers.getVoterRFID);

module.exports = router;