const express = require('express');
const datarouter = express.Router()
const datacontroller = require('../controllers/dataprocess');

datarouter.get('/data',datacontroller.getalldata)
datarouter.post('/delete',datacontroller.deleteall)
datarouter.get('/filters',datacontroller.getfiltersdata)
datarouter.get('/filtereddata',datacontroller.filtereddata)
datarouter.put('/updatedata',datacontroller.updatedata)

module.exports = datarouter