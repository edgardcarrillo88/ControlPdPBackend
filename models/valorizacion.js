const mongoose = require('mongoose')

const HHSchema = mongoose.Schema({
    Gasto: String,
    Categoria: String,
    SubCategoria: String,
    Descripcion: String,
    CostoHH: Number,
    personas: Number,
    Horas:Number,
    CostoParcial: Number,     
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const EquiposxhoraSchema = mongoose.Schema({
    Gasto: String,
    Categoria: String,
    SubCategoria: String,
    Descripcion: String,
    CostoH: Number,
    Cantidad: Number,
    Horas:Number,
    CostoParcial: Number,     
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const EquiposxturnoSchema = mongoose.Schema({
    Gasto: String,
    Categoria: String,
    SubCategoria: String,
    Descripcion: String,
    CostoTurno: Number,
    Cantidad: Number,
    Turnos:Number,
    CostoParcial: Number,     
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const GG1Schema = mongoose.Schema({
    Gasto: String,
    Categoria: String,
    SubCategoria: String,
    Descripcion: String,
    TipoCompensacion: String,
    Cantidad: Number,
    Metrado: Number,
    Unidad: String,
    CostoUnitario: Number,
    CostoParcial: Number,     
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const GG2Schema = mongoose.Schema({
    Gasto: String,
    Categoria: String,
    SubCategoria: String,
    Descripcion: String,
    TipoCompensacion: String,
    Cantidad: Number,
    CantidadParadas: Number,
    Unidad: String,
    CostoUnitario: Number,
    CostoParcial: Number,     
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const ReembolsableSchema = mongoose.Schema({
    Gasto: String,
    Categoria: String,
    SubCategoria: String,
    Descripcion: String,
    CostoUnitario: Number,
    Cantidad: Number,
    CostoParcial: Number,     
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const DetalleHHSchema = mongoose.Schema({
    Categoria: String,
    SubCategoria: String,
    DNI: String,
    Nombre: String,
    Cargo: String,
    Movilizacion: String,
    D01: Number,
    D02: Number,
    D03: Number,
    D04: Number,
    D05: Number,
    D06: Number,
    D07: Number,
    D08: Number,
    D09: Number,
    D10: Number,
    D11: Number,
    D12: Number,
    D13: Number,
    D14: Number,
    D15: Number,
    D16: Number,
    D17: Number,
    D18: Number,
    D19: Number,
    D20: Number,
    D21: Number,
    D22: Number,
    D23: Number,
    D24: Number,
    D25: Number,
    D26: Number,
    D27: Number,
    D28: Number,
    D29: Number,
    D30: Number,
    D31: Number,
    Desmovilizacion: String,     
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const DetalleHMSchema = mongoose.Schema({
    Categoria: String,
    SubCategoria: String,
    Descripcion: String,
    PLACAoSERIE: String,
    Cantidad: Number,
    Movilizacion: String,
    D01: Number,
    D02: Number,
    D03: Number,
    D04: Number,
    D05: Number,
    D06: Number,
    D07: Number,
    D08: Number,
    D09: Number,
    D10: Number,
    D11: Number,
    D12: Number,
    D13: Number,
    D14: Number,
    D15: Number,
    D16: Number,
    D17: Number,
    D18: Number,
    D19: Number,
    D20: Number,
    D21: Number,
    D22: Number,
    D23: Number,
    D24: Number,
    D25: Number,
    D26: Number,
    D27: Number,
    D28: Number,
    D29: Number,
    D30: Number,
    D31: Number,
    Desmovilizacion: String,     
    deleted: {type: Boolean, default:false}
},
{
    timestamps:true
})


const HH = mongoose.model('HH',HHSchema, 'HH')
const Equiposxhora = mongoose.model('Equiposxhora',EquiposxhoraSchema, 'Equiposxhora')
const Equiposxturno = mongoose.model('Equiposxturno',EquiposxturnoSchema, 'Equiposxturno')
const GG1 = mongoose.model('GG1',GG1Schema, 'GG1')
const GG2 = mongoose.model('GG2',GG2Schema, 'GG2')
const Reembolsable = mongoose.model('Reembolsable',ReembolsableSchema, 'Reembolsable')
const DetalleHH = mongoose.model('DetalleHH',DetalleHHSchema, 'DetalleHH')
const DetalleHM = mongoose.model('DetalleHM',DetalleHMSchema, 'DetalleHM')

module.exports = 
{
    HH,
    Equiposxhora,
    Equiposxturno,
    GG1,
    GG2,
    Reembolsable,
    DetalleHH,
    DetalleHM
}