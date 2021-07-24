const express = require('express');
const router = express.Router();

const classroomController = require('../controllers/classroomController');

/* GET http://localhost:3200/classroom/:id */
router.get('/:id',classroomController.index);



module.exports = router;
