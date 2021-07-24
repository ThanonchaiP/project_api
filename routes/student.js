const express = require('express');
const router = express.Router();
const passportJWT = require('../middleware/passportJWT');

const studentController = require('../controllers/studentController');

/* GET http://localhost:3200/student/ */
router.get('/',studentController.index);

/* GET http://localhost:3200/student/:id */
router.get('/:id',studentController.getById);

/* GET http://localhost:3200/student/education/:id */
router.get('/education/:id',studentController.educationHistory);

/* POST http://localhost:3200/student/ */
router.post('/',studentController.insert);

/* POST http://localhost:3200/student/search */
router.post('/search',studentController.searchStudent);

/* Delete http://localhost:3200/student/:id */
router.delete('/:id',studentController.delete);

/* Update http://localhost:3200/student/:id */
router.put('/:id',studentController.update);


module.exports = router;
