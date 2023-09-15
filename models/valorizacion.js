const mongoose = require('mongoose')

const valorizacionschema = mongoose.Schema({
    PersonalSupervision: String,
    CostoHH: Number,
    personas: Number,
    Horas:Number,
    Costo: Number,     
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const valorizacion = mongoose.model('valorizacion',valorizacionschema, 'valorizacion')
module.exports = valorizacion