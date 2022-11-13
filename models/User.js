const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const {Schema} = mongoose


const userSchema = new Schema({
    userNombre:{
        type: String,
        lowercase: true,
        required: true
    },
    userEmail: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    },
    tokenConfirm: {
        type: String,
        default: null
    },
    cuentaConfirmada: {
        type: Boolean,
        default: false
    },
    imagen: {
        type: String,
        default: null
    }
})

userSchema.pre('save', async function(next){
    const user = this //la propiedad 'this' tiene acceso a cada una de las propiedades del schema, por eso el uso de Funtion y no de arrow funtion
if(!user.isModified('password')) return next() //si la contraseña no se hasheó(modificada) retornamos en next()

    try {
        
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)

    user.password = hash
    next()
    
    } catch (error) {
        console.log(error)
        throw new Error('error al codificar la contraseña ')
    }

})


userSchema.methods.comparePassword = async function(candidatePassword){
   return await bcrypt.compare(candidatePassword, this.password) //this.password seria la contraseña almacenada en la bD y el candidate seria la que le estamos enviando, la ingresada por el usuario
}                           //por eso el metodo lo hacemos aca, ya que la propiedad 'password' es la misma del modelo tanto como en la base datos, asi lo requiere mongoose


module.exports = mongoose.model("User", userSchema)//el 'User' es el parametro enviado a base de datos, aunque la base de datos nos lo pondra en plural cuando sea creada
                            //en plural y en minuscula lowercase, lo pondra por defecto la BD