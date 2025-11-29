const mongoose = require ("mongoose")
const itemSchema = require('./itemModel');

const restauranteroSchema = mongoose.Schema({
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
    menu:[itemSchema],
},{
    timestamps: true
})

module.exports = mongoose.model("Restaurantero", restauranteroSchema)