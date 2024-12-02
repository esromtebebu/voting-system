const express = require('express');
const { check } = require('express-validator');

const adminsControllers = require('../controllers/admins-controllers');

const router = express.Router();

router.post('/create', adminsControllers.createAdmin);
router.patch('/:adminRFID/update', adminsControllers.modifyAdmin);
router.get('/rfid', adminsControllers.getAdminRFID);
router.get('/image', adminsControllers.getAdminImage);
router.delete('/:adminRFID/delete', adminsControllers.removeAdmin);
router.get('/:adminRFID', adminsControllers.getAdminById);
router.post('/:adminRFID/verify', adminsControllers.checkAdminIdentityByImage);
router.post('/login', adminsControllers.login);
module.exports = router;