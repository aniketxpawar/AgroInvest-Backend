const express = require('express')
const router = express.Router();
const harvestController = require('./harvestController')

router.get('/',harvestController.createHarvest)
router.get('/getHarvestByFarmerId/:id',harvestController.getHarvestByFarmerId)

module.exports = router;