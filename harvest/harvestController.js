const harvest = require('../models/harvest')
const { ObjectId } = require('mongodb');

const createHarvest = async(req,res,next) => {
    try{
        const newHarvest = await harvest.create({
            farmer: new ObjectId(''),
            crop: "",
            expectedHarvestDate: new Date('1990-01-15'),
            quantity: 0,
            totalInvestment: 0,
            amountPerKg: mongoose.Types.Decimal128.fromString('123.45'),
        })

        res.status(200).json(newHarvest)
    } catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error.")
    }
}

module.exports = {createHarvest}