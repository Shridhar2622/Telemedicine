    const jwt=require('jsonwebtoken')


    //verify patient
    async function patientRoleMiddleware(req,res,next){
        try {
            
            const role=req.user.role
            if( role !== "Patient"){
                return res.status(403).json({
                    message: "You are not authorized"
                })
            }
            next()
            
        } catch (e) {
            console.log(e)
            return res.status(200).json({
                message: "server error"
            })
        
        }
    }





    module.exports={patientRoleMiddleware}