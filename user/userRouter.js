const express = require('express')
const router = express.Router();
const userController = require('./userController')

router.get('/', async (req, res, next) => {
    res.send("Hello, AgroInvest");
})

router.post('/signupfarmer', userController.signupfarmer)
router.post('/signupinvestor', userController.signupinvestor)
router.post('/login', userController.login)
router.post('/verifyotp', userController.verifyOtp)
router.post('/resendotp', userController.resendOtp)
router.get('/getFarmers', userController.getFarmersList)
router.get('/getUserById/:id', userController.getUserById)

module.exports = router;