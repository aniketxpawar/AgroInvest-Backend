const express = require('express');
require('dotenv').config();
const userRouter = require('./user/userRouter.js');
const harvestRouter = require('./harvest/harvestRouter.js');
const investmentRouter = require('./investment/investmentRouter.js');
const mongoose = require('mongoose');

const cors = require('cors');
const morgan = require('morgan');

const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
)

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


app.use("/user",userRouter)
app.use("/harvest",harvestRouter)
app.use("/investment",investmentRouter)

app.listen(process.env.PORT,()=>console.log("Server is running at port "+process.env.PORT));

