const xlsx = require('xlsx');
const taskmodel = require('../models/task')
const updatemodel = require('../models/updates')
const valorizacionmodel = require('../models/valorizacion')
const mongoose = require('mongoose')


const uploadexcel = (req, res) => {

    const filepath = req.file.path
    const workbook = xlsx.readFile(filepath)
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    const dataPromises = excelData.map(async (rowData) => {
        try {
            rowData.curva = 'Linea base'

            console.log(rowData.inicioplan);
            const fechainicio = new Date((rowData.inicioplan - 25569) * 86400 * 1000);
            fechainicio.setMilliseconds(fechainicio.getMilliseconds() + 100);
            // const fechainicioFormateada = format(fechainicio, 'dd/MM/yyyy HH:mm');
            // rowData.inicioplan = fechainicioFormateada;
            console.log(fechainicio);
            rowData.inicioplan = fechainicio.toISOString();
            console.log(rowData.inicioplan);

            console.log(rowData.finplan);
            const fechafin = new Date((rowData.finplan - 25569) * 86400 * 1000);
            fechafin.setMilliseconds(fechafin.getMilliseconds() + 100);
            // const fechafinFormateada = format(fechafin, 'dd/MM/yyyy HH:mm');
            //rowData.finplan = fechafinFormateada;
            console.log(fechafin);
            rowData.finplan = fechafin.toISOString();
            console.log(rowData.finplan);

            const data = new taskmodel(rowData);
            await data.save();

        } catch (error) {
            console.error('Error al guardar el dato:', error);
        }
    });
    Promise.all(dataPromises)
        .then(() => {
            console.log('Todos los datos guardados en la base de datos');
            res.status(200).json({ message: 'Datos guardados en la base de datos' });
        })
        .catch((error) => {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ error: 'Error al guardar los datos' });
        })
}


const getalldata = async (req, res) => {
    console.log("ejecutando request getalldata");
    const data = await taskmodel.find({}).sort({ id: 1 })
    res.status(200).json({ data })
}


const getfiltersdata = async (req, res) => {
    console.log("ejecutando datos para filtros");

    const uniqueResponsables = await taskmodel.distinct('responsable');
    const uniqueContratistas = await taskmodel.distinct('contratista');
    const uniqueEstados = await taskmodel.distinct('estado');

    const data = [];

    for (let i = 0; i < uniqueResponsables.length; i++) {
        const uniqueValueObject = {
            responsable: uniqueResponsables[i],
            contratista: uniqueContratistas[i],
            estado: uniqueEstados[i],
        };
        data.push(uniqueValueObject);
    }

    res.status(200).json({ data })
}


const filtereddata = async (req, res) => {
    console.log("ejecutando request filtereddata");
    const { id } = req.query
    const data = await taskmodel.find({ id })
    res.status(200).json(data[0])
}


const updatedata = async (req, res) => {
    const { id, idtask, comentario, inicio, fin, avance, usuario, lastupdate, vigente } = req.body;

    console.log(usuario);
    console.log(inicio);
    let newinicio;
    let newfin;

    if (inicio) {
        const [fechainicio, horainicio] = inicio.split('T');
        const [anhoinicio, mesinicio, diainicio] = fechainicio.split('-');
        const [horasinicio, minutosinicio] = horainicio.split(':');
        newinicio = `${diainicio}/${mesinicio}/${anhoinicio}, ${horasinicio}:${minutosinicio}`;
    }

    if (fin) {
        const [fechafin, horafin] = fin.split('T');
        const [anhofin, mesfin, diafin] = fechafin.split('-');
        const [horasfin, minutosfin] = horafin.split(':');
        newfin = `${diafin}/${mesfin}/${anhofin}, ${horasfin}:${minutosfin}`;
    }


    console.log(newinicio);
    console.log(newfin);
    const data = await taskmodel.findByIdAndUpdate(id, {
        $set: {
            comentarios: comentario,
            inicioreal: inicio,
            finreal: fin,
            avance: avance,
            usuario: usuario,
            lastupdate: lastupdate,
        }
    }, { new: true })


    const updated = await updatemodel.find({ idtask })
    console.log(updated);
    updated.map(async (item) => {
        const data = await updatemodel.findByIdAndUpdate(item._id, {
            $set: {
                vigente: "No"
            }
        })
    })

    req.body.inicio = inicio;
    req.body.fin = fin;
    req.body.idtask = idtask;
    const dataupdated = new updatemodel(req.body)
    await dataupdated.save();

    console.log("ejecutando request updatedata");
    res.status(200).json(data)


}


const deleteall = async (req, res) => {
    console.log("borrando todo");
    taskmodel.deleteMany({})
        .then(() => {
            console.log('Todos los documentos eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}


const statusupdate = async (req, res) => {
    console.log("actualizando status");
    const { fechaActual } = req.body;
    const data = await taskmodel.find({}).sort({ id: 1 })

    data.map(async (task) => {
        const fechainiciobd = new Date(task.inicioplan)
        const fechafinbd = new Date(task.finplan)
        const fechafrontend = new Date(fechaActual)


        if (task.avance === undefined) {
            // console.log("No iniciado");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "No iniciado"
                }
            })
        }

        if (fechafrontend > fechainiciobd && task.avance === undefined) {
            // console.log("tarea atrasada");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "Atrasado"
                }
            })
        }

        if (fechafrontend > fechafinbd && task.avance !== 100) {
            // console.log("tarea atrasada");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "Atrasado"
                }
            })
        }



        if (task.avance === 100) {
            // console.log("Finalizado");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "Finalizado"
                }
            })
        }
    })
}


const deletehistory = async (req, res) => {
    console.log("borrando el historial de datos");
    updatemodel.deleteMany({})
        .then(() => {
            console.log('Todos los documentos eliminados correctamente');
        })
        .catch((error) => {
            console.error('Error al eliminar documentos:', error);
        });
}


const getdatahistory = async (req, res) => {
    console.log("ejecutando get data history");
    const data = await updatemodel.find({}).sort({ id: 1 })
    res.status(200).json({ data })
}


const valorizaciones = async (req, res) => {
    console.log("procesando valorizaciones");


    const filepath = req.file.path
    const workbook = xlsx.readFile(filepath)
    const arrayobject = Object.values(valorizacionmodel)

    const dataPromises = [];

    for (const item of arrayobject) {
        if (!!item.model && item !== null) {
            const modelName = item.modelName;
            const Model = mongoose.model(modelName);
            const worksheet = workbook.Sheets[modelName];
            const excelData = xlsx.utils.sheet_to_json(worksheet);

            const modelPromises = excelData.map(async (rowData) => {
                try {
                    const data = new Model(rowData);
                    await data.save();

                } catch (error) {
                    console.error('Error al guardar el dato:', error);
                }
            });
            dataPromises.push(Promise.all(modelPromises));
        }
    }

    Promise.all(dataPromises)
        .then(() => {
            console.log('Todos los datos guardados en la base de datos');
            res.status(200).json({ message: 'Datos guardados en la base de datos' });
        })
        .catch((error) => {
            console.error('Error al guardar los datos:', error);
            res.status(500).json({ error: 'Error al guardar los datos' });
        })
}


const dataedp = async (req, res) => {
    console.log("Obteniendo datos de valorizaciones");
    const arrayobject = Object.values(valorizacionmodel);
    const dataPromises = [];

    for (const item of arrayobject) {
        const modelName = item.modelName;
        const Model = mongoose.model(modelName);
        // Agrega una promesa para buscar todos los documentos en el modelo y almacenarla en dataPromises
        dataPromises.push(Model.find({}).sort({ id: 1 }));
    }

    try {
        // Espera a que se completen todas las promesas de búsqueda en los modelos
        const data = await Promise.all(dataPromises);

        res.status(200).json({ data });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).json({ error: 'Error al obtener los datos' });
    }
};



const deleteallEdp = async (req, res) => {
    console.log("Borrando todos los datos");

    try {
        const modelos = Object.values(valorizacionmodel);

        for (const modelo of modelos) {
            await modelo.deleteMany({});
        }

        console.log('Todos los documentos eliminados correctamente');
        res.status(200).send('Todos los documentos eliminados correctamente');
    } catch (error) {
        console.error('Error al eliminar documentos:', error);
        res.status(500).send('Error al eliminar documentos');
    }
};


module.exports = {
    uploadexcel,
    getalldata,
    filtereddata,
    updatedata,
    getfiltersdata,
    deleteall,
    statusupdate,
    deletehistory,
    getdatahistory,
    valorizaciones,
    dataedp,
    deleteallEdp
}