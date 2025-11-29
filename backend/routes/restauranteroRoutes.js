// backend/routes/restauranteroRoutes.js

const express = require('express');
const router = express.Router();
const { updateMenu, getPublicMenu } = require('../controllers/restauranteroController');
const { protect } = require('../middleware/authMiddleware'); 

// Ruta para actualizar el menú (Privada, requiere JWT)
router.route('/menu').put(protect, updateMenu); 

// 💡 NUEVA RUTA: Obtener el menú por ID (Pública, NO requiere protect)
router.route('/:idRestaurantero/menu').get(getPublicMenu); 

module.exports = router;