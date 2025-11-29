const express = require("express");
const router = express.Router();
// 💡 Asegúrate de que el controlador ahora se llama authController
const { registerUser, loginUser, data } = require("../controllers/authController"); 

const { protect } = require('../middleware/authMiddleware');
// Endpoint para el Login
router.post("/login", loginUser);

// Endpoint para el Registro. El parámetro :type indica si es comensal o restaurantero.
router.post("/register/", registerUser);

router.route('/data').get(protect, data);

module.exports = router;