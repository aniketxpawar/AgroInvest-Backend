const express = require('express')
const router = express.Router();
const investmentController = require('./investmentController')

router.post('/newInvestment',investmentController.createInvestment)
router.get('/getInvestmentsByUserId/:id',investmentController.getInvestmentsByUserId)

module.exports = router;