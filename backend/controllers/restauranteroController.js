// backend/controllers/restauranteroController.js

const asyncHandler = require('express-async-handler');
// Necesitamos importar el modelo Restaurantero para la actualización
const Restaurantero = require('../models/restauranteroModel'); 

// ----------------------------------------------------
// @desc    Actualiza solo el campo 'menu' del Restaurantero
// @route   PUT /api/restaurantero/menu
// @access  Private (Restaurantero)
// ----------------------------------------------------
const updateMenu = asyncHandler(async (req, res) => {
    // 1. Validar Rol (La restricción SÍ va aquí)
    if (req.user.type !== 'Restaurantero') {
        res.status(401);
        throw new Error('Acceso no autorizado. Solo Restauranteros pueden modificar el menú.');
    }

    const { menu } = req.body;

    // 2. Validaciones de cuerpo (se mantienen)
    if (!menu || !Array.isArray(menu) || !menu.every(item => item.nombre && item.precio)) {
        res.status(400);
        throw new Error('El cuerpo de la solicitud debe contener un array "menu" válido con nombre y precio.');
    }
    
    // 3. Lógica de Actualización: Usamos req.user.id
    const restauranteroUpdated = await Restaurantero.findByIdAndUpdate(
        req.user.id, 
        { menu: menu }, // SÓLO actualizamos el campo 'menu'
        { new: true, runValidators: true }
    ).select('-password'); 

    if (!restauranteroUpdated) {
        res.status(404);
        throw new Error('Restaurantero no encontrado.');
    }

    res.status(200).json(restauranteroUpdated);
});
// ----------------------------------------------------
// @desc    Obtener solo el menú de un Restaurantero por ID (PÚBLICO)
// @route   GET /api/restaurantero/:idRestaurantero/menu
// @access  Public
// ----------------------------------------------------
const getPublicMenu = asyncHandler(async (req, res) => {
    // 1. Obtener el ID del Restaurantero de los parámetros de la URL
    const { idRestaurantero } = req.params; 

    // 2. Buscar al Restaurantero por ID
    const restaurantero = await Restaurantero.findById(idRestaurantero);

    if (!restaurantero) {
        res.status(404);
        throw new Error('Restaurante no encontrado.');
    }

    // 3. Devolver solo el array 'menu'
    res.status(200).json(restaurantero.menu);
});

module.exports = {
    updateMenu,
    getPublicMenu, //Exportar la nueva función
};
