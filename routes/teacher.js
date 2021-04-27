const express = require('express');
const router = express.Router();

const teacherController = require('../controllers/teacherController');

/* GET http://localhost:3200/teacher/ */
router.get('/',teacherController.index);

/* GET http://localhost:3200/teacher/:id */
router.get('/:id',teacherController.getById);

/* POST http://localhost:3200/teacher/ */
router.post('/',teacherController.insert);

/* Delete http://localhost:3200/teacher/:id */
router.delete('/:id',teacherController.delete);

/* Update http://localhost:3200/teacher/:id */
router.put('/:id',teacherController.update);


module.exports = router;
