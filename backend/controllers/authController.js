const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const asyncHandler = require("express-async-handler")

// 💡 CLAVE: Reemplazamos el modelo "User" por los dos modelos de SplitCheck
const Comensal = require ("../models/comensalModel")
const Restaurantero = require ("../models/restauranteroModel")

//función para generar el token 
const generarToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: "30d"
    })
}

// @desc    Autenticar un usuario (Adaptado de login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler( async(req, res) => {
    const {email, password} = req.body
    
    //Busca en ambos modelos
    let user = await Comensal.findOne({email})
    let userType = 'Comensal'

    if (!user) {
        user = await Restaurantero.findOne({email})
        userType = 'Restaurantero'
    }

    // si el usuario existe verifico el hash
    if (user && (await bcrypt.compare(password, user.password))){
        res.status(200).json({
            _id: user.id,
            // Usamos el campo de nombre correcto
            nombre: userType === 'Comensal' ? user.nombre : user.nombreNegocio, 
            email: user.email,
            token: generarToken(user.id),
            type: userType // Indicamos el tipo de usuario logueado
        })
    } else {
        res.status(400)
        throw new Error("Credenciales inválidas (email o password)")
    }
})

// @desc    Registrar un usuario (Adaptado de register)
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler( async(req, res) => {
    // 1.Obtener 'type' junto con los otros campos de req.body
    const {nombre, email, password, nombreNegocio, type} = req.body 

    // 2. Definimos userType en minúsculas para la lógica (Comensal vs Restaurantero)
    const userType = type ? type.toLowerCase() : undefined;
    
    // Seleccionar el modelo y el campo de nombre
    // 3. Reemplazamos 'type' por 'userType' en la lógica
    const Model = userType === 'comensal' ? Comensal : Restaurantero;
    const nameField = userType === 'comensal' ? nombre : nombreNegocio;
    
    // 4. Verificamos datos mínimos (incluyendo userType)
    if(!email || !password || !nameField || !userType){ 
        res.status(400)
        throw new Error ("Faltan datos")
    }

    const userExists = await Model.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error ("Ese usuario ya existe")
    } 

    // Hash al password (Igual que tu código)
    const salt = await bcrypt.genSalt(10)
    const passwordHashed = await bcrypt.hash(password,salt)

    // Crear el usuario
    const userData = { email, password: passwordHashed };

    if (userType === 'comensal') {
    userData.nombre = nombre;
    } else {
    // 💡 Asegúrate de que ambas propiedades se incluyen
    userData.nombreNegocio = nombreNegocio;
    userData.nombre = nombre; // <-- Asegúrate de que esta línea esté presente
    }
    
    const user = await Model.create(userData)

    if(user){
        res.status(201).json({
            _id: user.id,
            nombre: nameField,
            email: user.email,
            token: generarToken(user.id), // Generamos el token de inmediato
            type: userType // 6. Reemplazamos 'type' por 'userType' en la respuesta
        })
    } else {
        res.status(400)
        throw new Error ("No se pudieron guardar los datos")
    }
})

const data = asyncHandler(async(req, res) => {
    // req.user viene del middleware (contiene el ID y el tipo)
    let user;
    
    if (req.user.type === 'Restaurantero') {
        // Buscamos al Restaurantero (para incluir el campo 'menu')
        user = await Restaurantero.findById(req.user.id).select('-password');
    } else {
        // Buscamos al Comensal
        user = await Comensal.findById(req.user.id).select('-password');
    }
    
    if (user) {
        user.type = req.user.type; 
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error("Usuario no encontrado.");
    }
});

module.exports={
    loginUser, 
    registerUser,
    data,
}