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
router.post('/resendotp', userController.resendOtp)
router.get('/getUserById/:id',userController.getUserById)
router.post('/addToCart', userController.addToCart)
router.get('/getCartItems/:userId', userController.getCartItemsByUserId)
router.delete('/removeFromCart/:id',userController.removeFromCart)
router.post('/checkout',userController.checkout);
router.post('/request',userController.sendRequest);
router.get('/getRequests/:id',userController.getRequests);

module.exports = router;