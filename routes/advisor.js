const express = require('express');
const router = express.Router();

const advisorController = require('../controllers/advisorController');

/* GET http://localhost:3200/advisor/ */
router.get('/',advisorController.index);

/* GET http://localhost:3200/advisor/year/:year */
router.get('/year/:year',advisorController.advisorWithYear);

/* GET http://localhost:3200/advisor/year */
router.get('/year',advisorController.year);

/* GET advisorWithTeacher http://localhost:3200/advisor/ */
router.get('/teacher/:id',advisorController.advisorWithTeacher);

/* GET http://localhost:3200/advisor/:id */
router.get('/:id',advisorController.getById);

/* POST http://localhost:3200/advisor/term */
router.post('/term',advisorController.advisorIdWithTerm);


module.exports = router;
