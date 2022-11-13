const express = require('express')
const { body } = require('express-validator')
const { loginForm, registerForm, registerUser, confirmarCuenta, loginUser, cerrarSesion } = require('../controllers/authController')
const router = express.Router()

        //rutas

router.get("/register", registerForm)
router.post("/register",[

        body("userNombre", "escriba un nombre valido").trim().notEmpty().escape(),
        body("userEmail", "escribe un email válido").trim().isEmail().normalizeEmail(),
        body("password", "ingrese contraseña válida de minimo 6 caracteres").trim().isLength({min: 6}).escape()
                .custom((value, { req }) => {
                        if(value !== req.body.RePassword){ //siendo 'value' la primera contraseña ingresada 
                                throw new Error('no coinciden las contraseñas')
                        }
                        return value
                })

/**este middleware almacena los errores si los hay, y el validationResult verifica de haberlos */],registerUser)
router.get("/confirmarCuenta/:token", confirmarCuenta)
router.get("/login", loginForm)
router.post("/login",[
        body("userEmail", "escribe un email válido")
                .trim()
                .isEmail()
        .normalizeEmail(),
        body("password", "ingrese contraseña válida de minimo 6 caracteres")
                .trim()
                .isLength({min: 6})
                .escape()]
        , loginUser)
router.get("/logout", cerrarSesion)//rutas y dentro, los controladores de las rutas     


module.exports = router