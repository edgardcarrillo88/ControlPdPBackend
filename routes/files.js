const express = require('express');
const filesrouter = express.Router()
const Upload =  require('../middleware/fileprocess')
const filecontroller = require('../controllers/dataprocess');

filesrouter.post('/',Upload.single('file'),filecontroller.uploadexcel)
filesrouter.post('/valorizaciones',Upload.single('file'),filecontroller.valorizaciones)
filesrouter.get('/dataedp',filecontroller.dataedp)
filesrouter.post('/deleteallEdp',filecontroller.deleteallEdp)

module.exports = filesrouter