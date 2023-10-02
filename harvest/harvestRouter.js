const express = require('express')
const router = express.Router();
const harvestController = require('./harvestController')

router.get('/',harvestController.createHarvest)
router.get('/getHarvestByFarmerId/:id',harvestController.getHarvestByFarmerId)
router.get('/getHarvestById/:id',harvestController.getHarvestById)

module.exports = router;