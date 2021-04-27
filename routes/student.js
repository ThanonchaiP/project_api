const express = require('express');
const router = express.Router();
const passportJWT = require('../middleware/passportJWT');

const studentController = require('../controllers/studentController');

/* GET http://localhost:3200/student/ */
router.get('/',[passportJWT.isLogin],studentController.index);

/* GET http://localhost:3200/student/:id */
router.get('/:id',studentController.getById);

/* POST http://localhost:3200/student/ */
router.post('/',studentController.insert);

/* Delete http://localhost:3200/student/:id */
router.delete('/:id',studentController.delete);

/* Update http://localhost:3200/student/:id */
router.put('/:id',studentController.update);


module.exports = router;
