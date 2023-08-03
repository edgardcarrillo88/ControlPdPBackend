const express = require('express');
const userrouter = express.Router()
const usercontroller = require('../controllers/login')

userrouter.post('/verify',usercontroller.loginHandler)
userrouter.post('/register',usercontroller.userregister)

module.exports = userrouter