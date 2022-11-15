const mongoose = require('mongoose') //esto llama al paquete 
require('dotenv').config()  //traernos las variables de entorno

const clientDB = mongoose.connect(process.env.URI)//y aqui procesamos las variables de entorno
    .then((c) => {
        console.log('db conectada 🤟♥')
        return c.connection.getClient() //esto nos trae el cliente de coneccion, en este caso mongoDB, ya que nos estamos conectado a él
    })
    .catch(e => console.log('falló la coneccion' +e))


module.exports = clientDB;