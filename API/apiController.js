const md5 = require('md5')
const bcrypt = require('bcryptjs');
const db = require('../models/user')

const signupfarmer = async (req,res,next) => {
    try{
        let {email, password, fullName, phone, userType} = req.body;
        password = await bcrypt.hash(password, 10);
        const newUser = await db.create({email,password,fullName,phone,userType:"farmer"})

        
    } catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error.")
    }
}

const login = async (req, res, next) => {
    try {
        let { email, password } = req.body;//password = (CryptoJS.AES.decrypt(cipher.toString(), '@rchstore123')).toString(CryptoJS.enc.Utf8);
        if(!email){
          res.status(401).send("Email is required");
        }
        if(!password){
          res.status(401).send("The password field is required");
        }
        const user = await db.findOne({email})
        if(!user){
          res.status(401).send("User not Found. Please Sign Up!")
        }
        if(user){
          if(!user.isActive){
            res
            .status(408)
            .send("Account is not active, please verify your email address!");
          }
          else {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
                    res.status(401).send("Invalid credentials");
                    return;
                  }
            const [accessToken, refreshToken] = await Promise.all([
                    jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '15m' }),
                    jwt.sign(payload, process.env.JWT_REFRESHTOKEN_KEY, { expiresIn: '30d' }),
                  ]);
            // res.setHeader("Authorization", `Bearer ${accessToken}`);
            // res.cookie('jwt', refreshToken, { httpOnly: true, 
            //   //sameSite: 'None', secure: true, 
            //   maxAge: 30 * 24 * 60 * 60 });
            res.send({ _id:user._id,email:user.email,fullName:user.fullName,message:"Login successful", accessToken, refreshToken });
          }
        }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  };

  module.exports = {signupfarmer, login};