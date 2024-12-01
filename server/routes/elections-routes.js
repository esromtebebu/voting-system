const express = require('express');
const { check } = require('express-validator');

const electionsControllers = require('../controllers/elections-controllers');

const router = express.Router();

router.get('/', electionsControllers.getElections);
router.get('/scan', electionsControllers.getElectionRFID);

module.exports = router;