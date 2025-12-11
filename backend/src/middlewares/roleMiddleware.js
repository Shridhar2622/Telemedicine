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
            return res.status(500).json({
                message: "server error"
            })
        
        }
    }


//doctore role middleware


    module.exports={patientRoleMiddleware}