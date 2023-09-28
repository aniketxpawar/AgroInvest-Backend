const harvest = require('../models/harvest')
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const createHarvest = async(req,res,next) => {
    try{
        const newHarvest = await harvest.create({
            farmer: new ObjectId('651456ee12ee480d4d1a2fd1'),
            crop: "Gram",
            expectedHarvestDate: new Date('2024-3-4'),
            quantity: 15,
            totalInvestment: 2025,
            amountPerKg: 135
        })

        res.status(200).json(newHarvest)
    } catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error.")
    }
}

const getHarvestById = async(req,res,next) => {
    try{
        const {id} = req.params;
    } catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error.")
    }
}

module.exports = {createHarvest, getHarvestById}