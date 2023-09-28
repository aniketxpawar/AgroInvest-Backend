const express = require('express');
require('dotenv').config();
const userRouter = require('./user/userRouter.js');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
)

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


app.use("/user",userRouter)

app.listen(process.env.PORT,()=>console.log("Server is running at port "+process.env.PORT));

