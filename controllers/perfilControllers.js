const formidable = require('formidable')
const jimp = require('jimp')
const path = require('path') //de los modulos nativos de nodejs
const fs = require('fs')// file sistem, modulo nativo de nodejs para manipular archivos en nuestro sistema
const User = require('../models/User')



module.exports.perfilForm = async(req, res) => {
    try {
        
    const user = await User.findById(req.user.id)
    
    res.render("perfil", {user: req.user, imagen: user.imagen})
    
    } catch (error) {
        req.flash("mensajes", [{msg: "error ak cargar al usuario"}])
        return res.redirect("/perfil")
    }
    
}

module.exports.editarFotoPerfil = async(req, res) => {
    const form = new formidable.IncomingForm
    form.maxfileSize = 5 * 1024 * 1024 //5mb
    
    form.parse(req, async(err, fields, files) => {//parse procesa la imagen pot la solicitus(req) del usuario

        try {
            if(err) throw new Error('falló la subida de imagen (formidable)')
            console.log(fields)
            console.log(files)
            const file = files.myFile
            
            if(file.originalFilename === "") throw new Error('primero agrega una imagen')

            const imageTypes = ['image/jpeg', 'image/png', 'image/jpg']
            
            if(!imageTypes.includes(file.mimetype)) throw new Error('solo imagenes de tipos jpeg, jpg, png!')

            if(file.size > 5 * 1024 * 1024) throw new Error('tamaño de imagen debe ser menor a 5MB')

            const extension = file.mimetype.split("/")[1]
            const dirFile = path.join(__dirname,`../public/img/perfiles/${req.user.id}.${extension}`);
            console.log(dirFile)
            
            fs.renameSync(file.filepath, dirFile) //(antiguaRuta, nuevaRuta) file system nos guarda el archivo en nustro sistema
            
            const imagen = await jimp.read(dirFile)
            imagen.resize(200, 200).quality(90).writeAsync(dirFile)


            const user = await User.findById(req.user.id)//buscamos al usuario autenticado en la bd 
            user.imagen = `${req.user.id}.${extension}` //a ese modelo (el usuario autenticado)modificamos la propiedad 'imagen' del modelo para el documento en la bd
            await user.save()//guardamos el usuario
            
            req.flash("mensajes", [{msg: "imagen subida satisfactoriamente"}])
            
        } catch (error) {
            req.flash("mensajes", [{msg: error.message}])
                        //key        //valor
        }finally{
            
            return res.redirect("/perfil") //el finally se ejecuta si o si, haya un error o la operacion ni siquiera los tenga
        }


    })
}