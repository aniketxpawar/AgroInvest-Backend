const express = require('express')
const router = express.Router();
const investmentController = require('./investmentController')

router.post('/newInvestment',investmentController.createInvestment)

module.exports = router;