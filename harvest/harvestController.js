const harvest = require('../models/harvest')
const { ObjectId } = require('mongoose').Types;
const db = require('../models/user')


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

const getHarvestByFarmerId = async(req,res,next) => {
    try{
        const {id} = req.params;
        const farmer = await db.findById(id).select('fullName location area')
        const harvests = await harvest.find({farmer: new ObjectId(id)})
        if(harvests.length==0){
            return res.status(404).json({message:"No Harvest of this Farmer"})
        }
        res.status(200).json({...farmer._doc,harvests})
    } catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error.")
    }
}

const getHarvestById = async(req,res,next) => {
    try{
        const {id} = req.params;
        const har = await harvest.findById(id)
        if(!har){
            return res.status(404).json({message:"Harvest not found"})
        }
        res.status(200).json(har)
    } catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error.")
    }
}

const getAllHarvest = async (req,res,next) => {
    try{
        const result = await harvest.find({soldOut:false}).populate({
            path: 'farmer',
            select: '_id fullName location',
          });
        if(!result){
            return res.status(403).json({message:"No Harvests Found"})
        }

        res.status(200).json(result);

    } catch(err){
        console.log(err);
        res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports = {createHarvest, getHarvestByFarmerId, getHarvestById, getAllHarvest}