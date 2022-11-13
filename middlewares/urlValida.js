const { URL } = require('url') //llamamos a paquete nativo de node js para validar end points

const urlValidar = (req, res, next) => {

    try {
        
    const { origin } = req.body //FORMULARIO:el valor del name (la url puesta por el usuario) tiene como nombre origin y viaja por el cuerpo y la tomamos aqui
    
    const UrlFrontend = new URL(origin)
    //UrlFrontend.protocol = ""

    if(UrlFrontend.origin !== "null" || UrlFrontend.protocol === ""){

        //si no se cumple la validacion con los protocolos http, salta al throw new error
        if(UrlFrontend.protocol === "http:" || UrlFrontend.protocol === "https:"){ //la url a la que redireccionaremos, ha de tener el protocolo https o https
            return next() //si esta todo correcto, retorna el next para la siguiente operacion, el siguiente middelware

        }
         throw new Error('la url debe tener https://  🪁')
    }
    
    
     throw new Error('no válida ⚽')

    } catch (error) {
        
        if(error.message === 'Invalid URL'){ //mensaje por defecto para errores del new URL
            req.flash("mensajes", [{msg: "url inválida ☠, no olvide agregar https://"}])
        }else{
            req.flash("mensajes", [{msg: error.message}]) //el error se envia a error.message mediante el throw new Error
        }
        
        
        
            
            return res.redirect("/")
            //return res.redirect("/editar/"+req.params.id) //lo redirecciona junto con el parametro(id) que este en ese moento en la sesion
        
    }

}

module.exports = urlValidar