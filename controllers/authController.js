const { nanoid } = require("nanoid")
const User = require("../models/User")
const {validationResult} = require('express-validator')
const nodemailer = require('nodemailer')
require('dotenv').config()

//-----registro--------------------------------------------------------------------------------------------------

const registerForm = (req, res) => {
    res.render("register")
}



const registerUser = async(req, res) => {
    
   const errors  = validationResult(req) //toma como parametro la solicitud y la evalua
 if(!errors.isEmpty()){ //errors no viene vacio? (es decir, tiene errores)true, no viene vacio, entra al if, false, sigue de largo 
    

    req.flash("mensajes", errors.array()) //pasamos el error a array para poder entenderlos desde la vista, e interactuamos con hbs
        return res.redirect('/auth/register')
 } 
   
   
   //console.log(req.body)
    const {userNombre, userEmail, password} = req.body
    try {
       
        let user = await User.findOne({userEmail: userEmail}) //propiedad (rojo) propiedad del schema
        if(user)  throw new Error('usuario ya existe')//el 'Error' viaja al catch, hacemos que salte al erroe. es una manera de validacion
        user = new User({userNombre, userEmail, password, tokenConfirm: nanoid()})
        await user.save() //crea un nuevo documento en la BD, la coleccion(nombre) la crea por defecto cuando le mandamos el parametro en el modelo
        
        //----->enviar correo electronico con la confirmacion de la cuenta<----
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.userEmail,
              pass: process.env.passEmail
            }
          });

          await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: user.userEmail, // list of receivers
            subject: "verifica tu cuenta de correo", // Subject line
            html: `<a href="http://localhost:5000/auth/confirmarCuenta/${user.tokenConfirm}">Verifica tu cuenta aquí</a>`, // html body
          });

        req.flash("mensajes", [{msg: "revisa tu correo electrónico y valida la cuenta"}])
        res.redirect("/auth/login")

        //res.json(user)
        //console.log(user)
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]) //el error se envia a error.message mediante el throw new Error
        return res.redirect("/auth/register")
        //res.json({error: error.message})
    }
    //res.json(req.body)
}


//------Confirmacion-------------------------------------------------------------------------------------------------

const confirmarCuenta = async(req, res) => {

    const { token } = req.params
    try {
        
    const user  = await User.findOne({tokenConfirm: token})
    if(!user) throw new Error('no existe este usuario, regístrese')
    
    user.cuentaConfirmada = true
    user.tokenConfirm = null
    await user.save()
    
    req.flash("mensajes", {msg: "cuenta validada, puede iniciar sesión"})
    res.redirect('/auth/login')
    
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect("/auth/login")
    }
}

//-----Login-----------------------------------------------------------------------------------------------------------


const loginForm = (req, res) => {
    res.render("login") //renderizar la pagina llamada login
}

const loginUser = async(req, res) => {
    
    const errors  = validationResult(req) //toma como parametro la solicitud y la evalua
    if(!errors.isEmpty()){ //errors no viene vacio? (es decir, tiene errores)true, no viene vacio, entra al if, false, sigue de largo 
        req.flash("mensajes", errors.array()) //pasamos el error a array para poder entenderlos desde la vista, e interactuamos con hbs
        return res.redirect('/auth/login')//por medio de la palabra reservada 'body' en el main (plantilla), redireccionamos los mensajes al login si hay errores
    }  
    
    const {userEmail, password} = req.body
    
    try {
        
        const user = await User.findOne({userEmail: userEmail})
        if(!user) throw new Error('este email no existe')

        if(!user.cuentaConfirmada) throw new Error('falta confirmar cuenta') //si la cuenta sigue en false en la BD entrará a este if

        if(!(await user.comparePassword(password))) throw new Error('contraseña incorrecta')//la contraseña guardada en base de datos es igual a la ingresada por el usuario? true: no es igual, entonces retorna el error. si son iguales dara false

        //manda el user a serialiazeUser en el index por medio de lgin
        req.login(user, function(err){ //el metodo login existe con passport, y me está creando la sesion para ser tomada en el index por medio del req.user
            if(err) throw new Error('hubo un problema con crear la sesión')
            return res.redirect("/") //lo mandamos al home luego de pasar todas las validaciones y que la sesion con passport no haya tenido errores al mandar los parametros del usuario
        })
        
        //res.redirect('/') //lo mandamos al Home si pasa todas las validaciones
        console.log(user)
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]) //el error se envia a error.message mediante el throw new Error
        return res.redirect("/auth/login")
        /*console.log(error)
        res.send(error.message)*/
    }
}


const cerrarSesion = (req, res, next) => {
    
    req.logout(function(err){ //req.logout era sincrono y ahora es asincrono por lo que requiere un callback
        if(err) return next(err)
        return res.redirect("/auth/login");
    
    });
}

module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
    cerrarSesion   
}