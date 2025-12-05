const asyncHandler = require("express-async-handler");
const Cuenta = require("../models/cuentaModel"); 
const Comensal = require("../models/comensalModel"); 
const mongoose = require('mongoose');


const createCuenta = asyncHandler(async (req, res) => {
    
    
    const { nombreMesa, itemsTotales} = req.body;

    if (!nombreMesa || !itemsTotales) {
        res.status(400);
        throw new Error("Faltan campos obligatorios: mesa o ítems.");
    }

    //Calcular el monto total de la cuenta automaticamente
    const montoTotal = itemsTotales.reduce((total, item) => {
        return total + (item.precio * item.cantidad);
    }, 0);

    const cuenta = await Cuenta.create({
        user: req.user._id, 
        nombreMesa,
        itemsTotales,
        montoTotal,
        estado: 'Abierta',
    });
   
    res.status(201).json(cuenta);
});


// @desc    Dividir la cuenta entre comensales y crear subcuentas (CLAVE)
// @route   PUT /api/cuentas/dividir/:id
// @access  Private 
const dividirCuenta = asyncHandler(async (req, res) => {
    const cuentaId = req.params.id;
    const { subcuentas } = req.body; 

    const usuarioAutenticadoId = req.user.id;

    const cuenta = await Cuenta.findById(cuentaId);

    if (!cuenta) {
        res.status(404);
        throw new Error("Cuenta no encontrada.");
    }

    if (cuenta.estado === 'Pagada') {
        res.status(400);
        throw new Error("La cuenta ya está pagada y no puede ser modificada.");
    }

    const nuevasSubcuentas = [];
    let totalDividido = 0;

    for (const subCuenta of subcuentas) {
        // 1. Calcular el total de esta subcuenta
        const totalSubcuenta = subCuenta.items.reduce((acc, item) => {
            return acc + (item.precio * item.cantidad);
        }, 0);
        totalDividido += totalSubcuenta;

        // 2. Crear la subcuenta (usando el esquema embebido)
        nuevasSubcuentas.push({
            // Usar el ID del usuario autenticado para el campo 'comensal'
            comensal: usuarioAutenticadoId, 
            
            //Usar el nombre del JSON para el campo 'duenoSubcuenta'
            duenoSubcuenta: subCuenta.nombreComensal, 
            itemsAsignados: subCuenta.items,
            totalSubcuenta: totalSubcuenta,
        });
    }

    // 3. Validación de que el total dividido coincida con el total de la cuenta
    if (Math.abs(totalDividido - cuenta.montoTotal) > 0.01) {
        res.status(400);
        throw new Error(`El total de las divisiones ($${totalDividido.toFixed(2)}) no coincide con el monto total de la cuenta ($${cuenta.montoTotal.toFixed(2)}).`);
    }

    // 4. Actualizar la cuenta
    cuenta.subcuentas = nuevasSubcuentas;
    cuenta.estado = 'Dividida';
    await cuenta.save();

    res.status(200).json(cuenta);
});


const getCuentaById = asyncHandler(async (req, res) => {
    // 1. Obtener la cuenta
    const cuenta = await Cuenta.findById(req.params.id);

    if (!cuenta) {
        res.status(404);
        throw new Error('Cuenta no encontrada.');
    }

    // 2. Validar Propiedad: El usuario autenticado debe ser el dueño de la cuenta.
    //    req.user.id es el ID del usuario logueado.
    //    cuenta.user es el ID del usuario que creó la cuenta.
    if (cuenta.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Acceso no autorizado. No eres el creador de esta cuenta.');
    }

    // 3. Devolver la cuenta
    res.status(200).json(cuenta);
});

const pagarSubcuenta = asyncHandler(async (req, res) => {
    // Implementar la lógica para marcar una subcuenta como pagada
    res.status(501).json({ message: "Endpoint 'pagarSubcuenta' no implementado." });
});

// @desc    Obtener el historial de todas las cuentas creadas por el usuario
// @route   GET /api/cuentas/historial
// @access  Private
// ----------------------------------------------------
const getHistorialCuentas = asyncHandler(async (req, res) => {
    
    //(Combinación): Asumimos que la propiedad es 'id' (sin guion bajo)
    // y forzamos la conversión a ObjectId, ya que Mongoose no lo hace.
    const userId = new mongoose.Types.ObjectId(req.user.id); 

    const cuentas = await Cuenta.find({ user: userId });

    res.status(200).json(cuentas);
});

module.exports = {
    createCuenta,
    dividirCuenta,
    getCuentaById,
    pagarSubcuenta,
    getHistorialCuentas,
};