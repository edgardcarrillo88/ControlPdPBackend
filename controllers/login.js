const jwt = require('jsonwebtoken')
const cookie = require('cookie')
const bcrypt = require('bcrypt')
const {serialize} = require('cookie');
const users = require('../models/users');

const loginHandler = async (req, res) => {

    console.log("iniciando proceso de logueo");
    console.log(req.body);
    const { email, password } = req.body
    console.log(`Verificando el correo ${email}`);


    users.findOne({ email })//findOne pertenece a mongoose y es un buscarv, devuelve la primera coincidencia
        .then((users) => { //.then funciona con finOne, findOne en realidad no devuelve ninguna promesa, eso lo hace lo que este dentro de .then
            if (!users) {
                console.log("El usuario no existe");
                return res.json({ message: "Usuario no encontrado" })
            }
            if (email === 'ea_carrillo@hotmail.com' && password === '123') {

                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
                    email: 'ea_carrillo@hotmail.com',
                    username: 'carrillo'
                }, 'secret')//este secret debería ser una variable de entorno

                console.log(token);

                const serialized = serialize('MyTokenName', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'none',//none para comunicarse con otro dominio
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    path: '/'
                })

                console.log(serialized);

                res.setHeader('Set-Cookie', serialized)
                console.log("inicio de sesión exitoso");
                return (
                    res.json({ response: 'Inicio de sesión exitoso', token: token })
                )
            }
        }
        )
}

module.exports = {loginHandler}