const mongoose = require("mongoose");
const itemSchema = require("./itemModel"); // Importamos el esquema de Ítem

// Definimos la estructura de la Subcuenta
const subcuentaSchema = mongoose.Schema({
    // ID del Comensal al que pertenece esta subcuenta
    comensal: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "La subcuenta debe estar asignada a un Comensal"],
        ref: "Comensal", // Referencia al modelo Comensal
    },
    duenoSubcuenta: {
        type: String,
        required: [true, 'El nombre del dueño de la subcuenta es obligatorio.'],
    },
    // Lista de ítems asignados a esta subcuenta
    itemsAsignados: [itemSchema], 
    
    // Estado de pago
    pagada: {
        type: Boolean,
        default: false,
    },
    
    // Total a pagar de esta subcuenta (calculado en el controlador)
    totalSubcuenta: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

// Exportamos el esquema, ya que será usado como sub-documento en Cuenta
module.exports = subcuentaSchema;