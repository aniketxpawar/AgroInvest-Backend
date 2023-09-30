const investment = require('../models/investment');
const harvest = require('../models/harvest');
const { ObjectId } = require('mongoose').Types;

const createInvestment = async(req,res,next) => {
    try{
        const {investorId,harvestId,qty} = req.body;
        const har = await harvest.findById(harvestId)
        if(har.quantity==0){
            return res.status(409).json({message:"Harvest is Sold Out"})
        }
        else if(har.quantity-qty == 0){
            har.soldOut = true;
        }
        har.quantity = har.quantity-qty;
        har.totalInvestment = har.totalInvestment - (qty*har.amountPerKg);
        const invest = await investment.create({
            investor: new ObjectId(investorId),
            harvest: new ObjectId(harvestId),
            quantity: qty,
            amount: qty * har.amountPerKg,
            investmentDate: new Date()
        })
        await har.save();
        res.status(200).json(invest)
    } catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
    }
}

const getInvestmentsByUserId = async(req,res,next) => {
    try{
        const {id} = req.params
        const inv = await investment.find({investor:new ObjectId(id)})
        if(!inv){
            return res.status(409).json({message:"You have not invested in any Harvests yet."})
        }
        res.status(200).json(inv)
    } catch(err){
        console.log(err)
        res.status(500).send("Internal Server Error")
    }
}

module.exports = {createInvestment, getInvestmentsByUserId}