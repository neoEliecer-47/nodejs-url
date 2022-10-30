const express = require('express')
const router = express.Router()

        //ruta

router.get("/", (req, res) => {
    const URLs = [
        {origin: "www.cinecalidad.run1", shortURL: "asdkk1"},
        {origin: "www.cinecalidad.run2", shortURL: "asdkk2"},
        {origin: "www.cinecalidad.run3", shortURL: "asdkk3"},
        {origin: "www.cinecalidad.run4", shortURL: "asdkk4"}
    ]
    
    res.render("home", { URLs: URLs })
})


module.exports = router