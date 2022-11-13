module.exports = (req, res, next) => {
    if(req.isAuthenticated()) return next() //si el usuario esta autenticado, tiene una sesion activa, retornamos el next para que siga (le damos paso) con la siguiente funcion(leerUrls) en la ruta. funcionando como middleware para proteger la ruta
    
    res.redirect("/auth/login")
}