const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const mongoStore = require('connect-mongo')
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors')
const { create } = require("express-handlebars")
const User = require('./models/User')
const csurf = require('csurf')
require("dotenv").config()
const clientDB = require('./databse/db')//nos traemos el cliente de la promesa


const app = express()
//const port = 5000;

const corsOptions = {
    credentials: true,                      //si existe el path, ocúpelo, de lo contrario use cualquiera
    origin: process.env.PATHHEROKU || "*", //la variable de entorno es la uri y en caso de que no exista '||' hace el 'todos'= '*'
    methods: ["GET"," POST"]
};
app.use(cors(corsOptions));


app.use(

    session({
        secret: process.env.SECRETSESSION,
        resave: false,
        saveUninitialized: false,
        name: "sessionu-user",
        store: mongoStore.create({ //'create' es para hacer configuraciones
            clientPromise: clientDB,
            dbName: process.env.DBNAME
        }),
        cookie: { secure: process.env.MODO === 'produccion' ? true : false, maxAge: 30 * 24 * 60 * 60 * 1000 },
                //secure trabaja con solicitudes https, por lo cual, localhost que trabaja con http, nos dará un error
    })
)

app.use(flash())                                                                                     

app.use(passport.initialize())
app.use(passport.session())

//inicializar passport
        //nos crea la sesión        
passport.serializeUser((user, done) => done(null, {id: user._id, userNombre: user.userNombre})) //a travez de passport, estamos creando un req.user mandandole las porpiedades del usuario que haga sesion, id y nombre en este caso
        //mantiene la sesión
passport.deserializeUser(async(user, done) => { //estamos reciendo el objeto aqui (user) del serializeUser

    const userDB = await User.findById(user.id)
    return done(null, {id: userDB._id, userNombre: userDB.userNombre})//{id: userDB._id, userNombre: userDB.userNombre} <---- con esto volvemos a crear el req.user
})


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
app.use(express.urlencoded({extended: true})) //para poder tomar los valores con post (por el body) activamos los formularios

app.use(csurf())
app.use(mongoSanitize())//esto intercepta los request y los limpia, para dar mas seguridad en nuestra BD

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken() // con esto no necesito enviar el token a cada vista (render), ahora lo configuramos de manera global para todas las renderizaciones en las vistas
    res.locals.mensajes = req.flash("mensajes")
    next()
})

app.use("/", require('./Routes/home'))
app.use("/auth", require('./Routes/auth'))


const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log('servidor trabajando ✅ '+PORT))

