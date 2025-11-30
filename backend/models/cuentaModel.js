const mongoose = require("mongoose");
const itemSchema = require("./itemModel"); // El esquema de Ítem
// 💡 Importamos el archivo renombrado
const subcuentaSchema = require("./subcuentaModel"); 

const cuentaSchema = mongoose.Schema({
    // Referencia al Restaurantero que creó la cuenta

    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'User', // 💡 Usa 'User' o el nombre exacto de tu colección de usuarios
    },

    nombreMesa: {
        type: String,
        required: [true, "Por favor, especifica el nombre o número de la mesa."],
        trim: true,
    },

    // Ítems originales de la cuenta total
    itemsTotales: [itemSchema],

    // Total de la cuenta
    montoTotal: {
        type: Number,
        required: [true, "El monto total de la cuenta es requerido."],
    },
    
    // Lista de las subcuentas generadas después de la división (esquema anidado)
    subcuentas: [subcuentaSchema], 

    // Estado general de la cuenta
    estado: {
        type: String,
        enum: ['Abierta', 'Dividida', 'Pagada'],
        default: 'Abierta',
    },
}, {
    timestamps: true,
});

const Cuenta = mongoose.model("Cuenta", cuentaSchema);
module.exports = Cuenta;