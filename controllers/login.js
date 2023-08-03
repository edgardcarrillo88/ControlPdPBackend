const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const bcrypt = require('bcrypt')
const { serialize } = require('cookie');
const usersmodel = require('../models/users');

// const loginHandler = async (req, res) => {

//     console.log("iniciando proceso de logueo");
//     console.log(req.body);
//     const { email, password } = req.body
//     console.log(`Verificando el correo ${email}`);


//     users.findOne({ email })//findOne pertenece a mongoose y es un buscarv, devuelve la primera coincidencia
//         .then((users) => { //.then funciona con finOne, findOne en realidad no devuelve ninguna promesa, eso lo hace lo que este dentro de .then
//             if (!users) {
//                 console.log("El usuario no existe");
//                 return res.json({ message: "Usuario no encontrado" })
//             }
//             if (email === 'ea_carrillo@hotmail.com' && password === '123') {

//                 const token = jwt.sign({
//                     exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
//                     email: 'ea_carrillo@hotmail.com',
//                     username: 'carrillo'
//                 }, 'secret')//este secret debería ser una variable de entorno

//                 console.log(token);

//                 const serialized = serialize('MyTokenName', token, {
//                     httpOnly: true,
//                     secure: false,
//                     sameSite: 'none',//none para comunicarse con otro dominio
//                     maxAge: 1000 * 60 * 60 * 24 * 30,
//                     path: '/'
//                 })

//                 console.log(serialized);

//                 res.setHeader('Set-Cookie', serialized)
//                 console.log("inicio de sesión exitoso");
//                 return (
//                     res.json({ response: 'Inicio de sesión exitoso', token: token })
//                 )
//             }
//         }
//         )
// }


const loginHandler = async (req, res) => {
    console.log("Ejecutando verificación de usuario");
    //console.log(req.query);
    const datausers = await usersmodel.findOne({ email: req.body.params.email })
    console.log(datausers);

    try {
        if (!datausers) {
            console.log("El usuario no existe");
            return res.json({ message: "Usuario no encontrado" })
        }
        if (datausers.email === req.body.params.email && datausers.contrasena === req.body.params.password) {
            console.log("Usuario verificado");
            res.status(200).json({ message: "usuario verificado", data: "goonloginsuccessfully", verify: datausers.verificado })
        }
    } catch (error) {
        console.error("error inesperado", error);
    }
}

const userregister = async (req, res) => {
    console.log("ejecutando creación de usuario");
    console.log(req.body);
    const data = new usersmodel(req.body);
    console.log(data);
    await data.save();
    res.status(200).json({response: "Usuario creado"})
}



module.exports = { loginHandler, userregister }