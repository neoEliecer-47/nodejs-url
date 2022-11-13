const express = require('express')
const { leerUrls, agregarUrl, eliminarUrl, editarUrlForm, editarUrl, redireccionarUrl } = require('../controllers/homeController')
const urlValidar = require('../middlewares/urlValida')
const verificarUser = require('../middlewares/verificarUser')
const router = express.Router()
const { body } = require('express-validator')
const { perfilForm, editarFotoPerfil } = require('../controllers/perfilControllers')

        //ruta
        

        //todas las paginas con el middleware virificarUser, tienen acceso al req.user, es decir, acceso al id y userNombre en este casos   
router.get("/", verificarUser, leerUrls) //ruta protegida
//drouter.get("/",  )
router.post("/", verificarUser, urlValidar,agregarUrl)//por el verificarUser, cada middlewware tiene acceso al req.user
router.get("/eliminar/:id", verificarUser, eliminarUrl)
router.get("/editar/:id" ,verificarUser ,editarUrlForm)
//router.get("/editar/:id", editarUrlFormError)
 //router.get("/editar", editarUrlFormError)
router.post("/editar/:id", verificarUser, urlValidar ,editarUrl)
router.get("/perfil", verificarUser, perfilForm)
router.post("/perfil", verificarUser, editarFotoPerfil)

router.get("/:shorturl", redireccionarUrl); //estamos tomando el valor del browser en la url en los controladores con la propiedad 'params'


module.exports = router


//[

  //      body("origin", "ingrese un URL válido").trim().notEmpty().isURL()//esto reemplaza mi antiguo middleware
  //body("origin", "ingrese un URL válido").trim().isURL().unescape()//esto reemplaza mi antiguo middleware
//]