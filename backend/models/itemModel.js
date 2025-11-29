const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true, default: 1 }
}, { _id: false }); 


module.exports = itemSchema;