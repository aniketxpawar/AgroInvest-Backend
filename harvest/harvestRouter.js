const express = require('express')
const router = express.Router();
const harvestController = require('./harvestController')

router.get('/',harvestController.createHarvest)

module.exports = router;