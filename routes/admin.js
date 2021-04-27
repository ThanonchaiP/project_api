const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');

/* GET http://localhost:3200/admin/ */
router.get('/',adminController.index);

/* GET http://localhost:3200/admin/:id */
router.get('/:id',adminController.getById);

/* POST http://localhost:3200/admin/ */
router.post('/',[
    body('name').not().isEmpty().withMessage('กรุณากรอกชื่อ'),//ทำ validation
    // body('lastname').not().isEmpty().withMessage('กรุณากรอกนามสกุล'),
    body('email').not().isEmpty().withMessage('กรุณากรอกอีเมล').isEmail().withMessage('รูปแบบอีเมลไม่ถูกต้อง'),
    body('password').not().isEmpty().withMessage('กรุณากรอก password').isLength({min:3}).withMessage('password ต้อง 3 ตัวขึ้นไป')
],adminController.insert);

/* Delete http://localhost:3200/admin/:id */
router.delete('/:id',adminController.delete);

/* Update http://localhost:3200/admin/:id */
router.put('/:id',adminController.update);

module.exports = router;
