const mongoose = require("mongoose")//llamando paquetes
const {Schema} = mongoose

const urlSchema = new Schema({
    origin: {
        type: String,
        unique: true,
        required: true,
    },
    shorturl: {
        type: String,
        unique: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", //nombre modelo del usuario
        required: true
    }
})

const Url = mongoose.model("Url", urlSchema)//la bd lo crea en lowercase y plural
module.exports = Url