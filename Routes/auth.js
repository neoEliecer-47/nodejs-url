const express = require('express')
const router = express.Router()

        //ruta

router.get("/login", (req, res) => {
    res.render("login")
})

module.exports = router