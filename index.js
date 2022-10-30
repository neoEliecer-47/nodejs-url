const express = require('express')
const app = express()
const port = 5000;
const { create } = require("express-handlebars")

const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"]
})

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");


                    //middlewares
app.use(express.static(__dirname + '/public')) //__dirname es, desde nuestro archivo index, toma la ruta publica (esto para informar al servidor que es lo que tomará)
//todo lo que en la ruta pública se coloque, pertenece al frontend, por lo cual será publica para el cliente por el navegador
app.use("/", require('./Routes/home'))
app.use("/auth", require('./Routes/auth'))

app.listen(port, () => console.log('servidor trabajando ✅'))

