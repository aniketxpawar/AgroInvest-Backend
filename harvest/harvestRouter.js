const express = require('express')
const router = express.Router();
const harvestController = require('./harvestController')

router.get('/',harvestController.createHarvest)
router.get('/getHarvestById',harvestController.getHarvestById)

module.exports = router;