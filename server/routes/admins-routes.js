const express = require('express');
const { check } = require('express-validator');

const adminsControllers = require('../controllers/admins-controllers');

const router = express.Router();

router.get('/', adminsControllers.getadmins);
router.get('/scan', adminsControllers.getadminRFID);

module.exports = router;