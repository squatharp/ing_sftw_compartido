// backend/routes/cuentaRoutes.js

const express = require("express");
const router = express.Router();

// 💡 Usamos el nombre 'createCuenta' que está en el controlador
const { 
    createCuenta,         
    getCuentaById, 
    dividirCuenta, 
    pagarSubcuenta,      // Importamos pagarSubcuenta (aunque aún no está implementada)
    getHistorialCuentas  // Importamos getHistorialCuentas
} = require("../controllers/cuentaController"); 

const { protect } = require("../middleware/authMiddleware"); 


// --- 1. RUTA ESPECÍFICA (Debe ir primero para evitar que sea confundida con un ID) ---

// GET /api/cuentas/historial (Obtener todas las cuentas creadas por el usuario)
router.route('/historial').get(protect, getHistorialCuentas);


// --- 2. RUTAS BASE y Específicas por Palabra Clave ---

// POST /api/cuentas (Crear una nueva cuenta)
router.route('/')
    .post(protect, createCuenta);


// PUT /api/cuentas/dividir/:id (Dividir la cuenta)
// Dejamos dividirCuenta en una ruta separada para claridad.
router.route('/dividir/:id').put(protect, dividirCuenta);


// PUT /api/cuentas/pagar/:subcuentaId (Pagar una subcuenta)
// Dejamos pagarSubcuenta en una ruta separada.
router.route('/pagar/:subcuentaId').put(protect, pagarSubcuenta);


// --- 3. RUTA GENÉRICA (Debe ir al final para no capturar /historial, /dividir, /pagar) ---

// GET /api/cuentas/:id (Obtener detalles de una cuenta específica)
router.route('/:id')
    .get(protect, getCuentaById); 
    // .put(protect, dividirCuenta); -> Ya no va aquí, pues tiene su propia ruta /dividir/:id

module.exports = router;