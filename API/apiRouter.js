const express = require('express')
const router = express.Router();
const apiController = require('./apiController')

router.get('/', async (req, res, next) => {
    res.send("Hello, AgroInvest");
})

router.post('/signupfarmer', apiController.signupfarmer)
router.post('/signupinvestor', apiController.signupinvestor)
router.post('/login', apiController.login)

module.exports = router;