const express = require('express');
const router = express.Router();
const {CreateAccount, LoginAccount, getCustomerByEmail, updateCustomerInfo, checkEmailExists, verifyEmail} = require('../controllers/authController')

router.post('/createaccount',CreateAccount);
router.post('/login',LoginAccount);
router.get('/customer', getCustomerByEmail);
router.post('/customer/update', updateCustomerInfo);
router.post('/checkemail', checkEmailExists);
router.get('/verify', verifyEmail);



module.exports = router;