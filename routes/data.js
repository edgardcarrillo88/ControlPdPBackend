const express = require('express');
const datarouter = express.Router()
const datacontroller = require('../controllers/dataprocess');

datarouter.get('/data',datacontroller.getalldata)
datarouter.get('/datahistory',datacontroller.getdatahistory)
datarouter.post('/delete',datacontroller.deleteall)
datarouter.post('/deletehistory',datacontroller.deletehistory)
datarouter.get('/filters',datacontroller.getfiltersdata)
datarouter.get('/filtereddata',datacontroller.filtereddata)
datarouter.put('/updatedata',datacontroller.updatedata)
datarouter.put('/updatestatus',datacontroller.statusupdate)

module.exports = datarouter