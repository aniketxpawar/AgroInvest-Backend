const express = require('express');
require('dotenv').config();
const apiRouter = require('./API/apiRouter.js');

const app = express();

app.use(express.json());

app.use("/",apiRouter)

app.listen(process.env.PORT,()=>console.log("Server is running at port "+process.env.PORT));