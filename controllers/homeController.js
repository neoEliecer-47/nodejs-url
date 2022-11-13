const Url = require("../models/url")
const {nanoid} = require("nanoid") // llamando paquetes
const { validationResult } = require('express-validator')



const leerUrls = async (req, res) => {
    
    console.log(req.user)
    try {
        
        const URLs = await Url.find({user: req.user.id}).lean() //trae un objeto de mongoose y con Lean lo pasamos a un objeto tradicional de JS para poder mandarlo a la vista ya que estamos trabajando con html(hbs) y no lo lee en 'formato' mongoose
        res.render("home", { urlsTraidasBd: URLs }) //lo estamos mandando a la vista llamada 'home'
                          //propiedad      //valor
    
    
    
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]) //el error se envia a error.message mediante el throw new Error
        return res.redirect("/")
    }
    
    
}

const agregarUrlForm = (req, res) => {
    
    res.render("home")
    
}

const agregarUrl = async(req, res) => {
    
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        req.flash("mensajes", errors.array())
        return res.redirect("/")
    }
    
    
    const {origin} = req.body
    try {
    
    const url = new Url({ origin: origin, shorturl: nanoid(6), user: req.user.id })
    await url.save()
    req.flash("mensajes", [{msg: "url agregada exitosamente✅"}])
    //console.log(url)
    res.redirect('/')
    
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]) //el error se envia a error.message mediante el throw new Error
        return res.redirect("/")
    }
}


const eliminarUrl = async(req, res) => {
    //req.user.id
    
    const id = req.params.id
    try {
        
    //await Url.findByIdAndDelete(id)
    const url = await Url.findById(id)

    if(!url.user.equals(req.user.id)){//si el user del modelo(de la url traida de la bd) es igual al user id de la sesion 
        throw new Error('no es tu Url, pendejo') //el throw new error no sigue con el codigo y pasa directamente al catch
    }
    
    await url.remove()
    req.flash("mensajes", [{msg: "url eliminada ❌"}])
    res.redirect('/')
    
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]) //el error se envia a error.message mediante el throw new Error
        return res.redirect("/")
    }
}

const editarUrlFormError = (res, req) => {
    res.render("editar")
    
}



const editarUrlForm = async(req, res) =>{
   // req.user.id
    
    const {id} = req.params

    try {
        
    const url = await Url.findById(id).lean()
    
    if(!url.user.equals(req.user.id)){
        throw new Error('no es tu Url, pendejo ☺') //esto tambien funciona como return
    }
    
    return res.render("home", {url})    
    
    
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]) //el error se envia a error.message mediante el throw new Error
        return res.redirect("/editar/"+req.params.id)
    }
}

const editarUrl = async(req, res) =>{
    
    /*const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash("mensajes", errors.array())
        //const id = new mongoose.Types.ObjectId(req.params.id);
        console.log(errors)
        return res.redirect("/")
    }*/

    
    const {id} = req.params //params en el navegador browser
    const {origin} = req.body //body de la modificacion del usuario en el FORMULARIO
    try {
        
        const url = await Url.findById(id)

        if(!url.user.equals(req.user.id)){
            throw new Error('no es tu Url, imbécil 😣')
        }

        await url.updateOne({ origin })
        req.flash("mensajes", [{msg: "Url editada correctamente 🖌"}])
        res.redirect("/") //lo envia al inicio si finalmente la url es modificada
        //await Url.findByIdAndUpdate(id, {origin: origin})
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]) //el error se envia a error.message mediante el throw new Error
        return res.redirect("/")
    }
}

const redireccionarUrl = async(req, res) => {
    const {shorturl} = req.params
    //console.log(shorturl)
    try {
        
    const urlDB = await Url.findOne({shorturl: shorturl})// (propiedad_del_modelo: propiedad_req.params) (para hacer el query en la base datos)
    //const {origin} = urlDB
    //console.log(urlDB.origin)
    //if (!urlDB?.origin) { //signo de interrogacion del query
       // console.log("no existe");
      //  return //res.send("error no existe el redireccionamiento");
    //}
    
    res.redirect(urlDB.origin) //resireccionamos a la url obtenida en la base datos con el parametro 'shortcut' obtenido con el params
    } catch (error) {
        req.flash("mensajes", [{msg: "no existe esta url configurada"}]) //el error se envia a error.message mediante el throw new Error
        return res.redirect("/auth/login")
    }
}

module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionarUrl,
    agregarUrlForm,
    editarUrlFormError
}