const signup = async (req,res,next) => {
    try{
        const {email, password} = req.body;
        
    } catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error.")
    }
}