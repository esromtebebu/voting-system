const express = require('express');
const { check } = require('express-validator');

const electionsControllers = require('../controllers/elections-controllers');

const router = express.Router();

router.post('/create', electionsControllers.newElection);
router.get('/getAll', electionsControllers.getAllElections);
router.get('/search/:electionId', electionsControllers.findById);
router.patch('/:electionId/update', electionsControllers.modifyElection);
router.patch('/:electionId/candidates', electionsControllers.addCandidate);
router.patch('/:electionId/vote', electionsControllers.addVote);


module.exports = router;