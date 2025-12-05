const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler") 
const Comensal = require("../models/comensalModel")
const Restaurantero = require("../models/restauranteroModel")

const protect = asyncHandler(async(req, res, next) => {
    let token 

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            let user = await Comensal.findById(decoded.id).select("-password")
            let userType = 'Comensal'

            if (!user) {
                user = await Restaurantero.findById(decoded.id).select("-password")
                userType = 'Restaurantero'
            }

            if (!user) {
                res.status(401)
                throw new Error("Acceso no autorizado: Token válido, pero el usuario no existe")
            }
            
            req.user = user
            req.user.type = userType 
            
            next()
        }
        catch(error){
            console.error(error)
            res.status(401)
            throw new Error("Acceso no autorizado: Token no válido o expirado")
        }
    }

    if(!token){
        res.status(401)
        throw new Error("Acceso no autorizado, No se proporcionó token")
    }
})

module.exports={protect}