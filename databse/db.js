const mongoose = require('mongoose') //esto llama al paquete 
mongoose.connect(process.env.URI)
    .then(() => console.log('db conectada 👽'))
    .catch(e => console.log('falló la coneccion' +e))