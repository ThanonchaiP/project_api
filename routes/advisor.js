const express = require('express');
const router = express.Router();

const advisorController = require('../controllers/advisorController');

/* GET http://localhost:3200/advisor/ */
router.get('/',advisorController.index);

/* GET http://localhost:3200/advisor/ */
router.get('/year/:year',advisorController.advisorWithYear);

/* GET advisorWithTeacher http://localhost:3200/advisor/ */
router.get('/teacher/:id',advisorController.advisorWithTeacher);

/* GET http://localhost:3200/advisor/:id */
router.get('/:id',advisorController.getById);

/* POST http://localhost:3200/advisor/ */
router.post('/',advisorController.insert);

/* Delete http://localhost:3200/advisor/:id */
router.delete('/:id',advisorController.delete);

/* Update http://localhost:3200/advisor/:id */
router.put('/:id',advisorController.update);

module.exports = router;
