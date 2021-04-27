const express = require('express');
const router = express.Router();
const passportJWT = require('../middleware/passportJWT');
const loginController = require('../controllers/loginController');

/* GET http://localhost:3200/login/admin */
router.post('/admin',loginController.loginAdmin);

/* GET http://localhost:3200/login/teacher */
router.post('/teacher',loginController.loginTeacher);

/* GET http://localhost:3200/login/profile */
router.get('/profile',[passportJWT.isLogin],loginController.profile);

module.exports = router;
