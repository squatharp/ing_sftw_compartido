const mongoose = require ("mongoose")

const comensalSchema = mongoose.Schema({
    nombre:{
        type: String,
        required:[true, "Por favor teclea tu nombre"]
    },
    email:{
        type: String,
        required:[true, "Por favor teclea tu email"],
        unique:true 
    },
    password:{
        type: String,
        required:[true, "Por favor teclea tu password"]
    },
    historialCuentas:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cuenta"
    }]
},{
    timestamps: true
})

module.exports = mongoose.model("Comensal", comensalSchema)