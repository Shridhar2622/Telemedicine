const jwt=require("jsonwebtoken")

async function authMiddleware(req,res,next){
    try {

        //get the token from header
        const authHeader=req.headers.authorization
        //check if it is present or not
        if(!authHeader || !authHeader.startsWith("Bearer "))
        {
            return res.status(401).json({
                message: "You are not authorized to this page"
            })
        }

        //get the token from the aray
        const token=authHeader.split(" ")[1];

        //verify token
        const decoded=jwt.verify(token,process.env.SECRET_KEY)


        //store the data in req object named as user
        req.user=decoded
        next()
        
    } catch (e) {
        console.log(e)
        res.status(503).json({
            message: "Servor issue"
        })
        
    }
    
}


module.exports= authMiddleware