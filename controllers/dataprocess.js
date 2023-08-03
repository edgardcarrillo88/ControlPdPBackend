const xlsx = require('xlsx');
const taskmodel = require('../models/task')
const updatemodel = require('../models/updates')


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
            console.log(data);
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
    console.log(req);
    console.log(req.query);
    console.log(req.body);
    console.log(req.body.id);
    const { id } = req.query
    console.log(id);
    const data = await taskmodel.find({ id })
    console.log(data);
    res.status(200).json(data[0])
}


const updatedata = async (req, res) => {
    const { id, idtask, comentario, inicio, fin, avance, usuario } = req.body;

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
        }
    }, { new: true })


    req.body.inicio = inicio;
    req.body.fin = fin;
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

        if (fechafrontend > fechainiciobd && task.avance === undefined) {
            console.log("tarea atrasada");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "Atrasado"
                }
            })
        }

        if (fechafrontend > fechafinbd && task.avance !== 100) {
            console.log("tarea atrasada");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "Atrasado"
                }
            })
        }

        if (task.avance === undefined) {
            console.log("No iniciado");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "No iniciado"
                }
            })
        }

        if (task.avance === 100) {
            console.log("Finalizado");
            const data = await taskmodel.findByIdAndUpdate(task._id, {
                $set: {
                    estado: "Finalizado"
                }
            })
        }
    })
}


module.exports = { uploadexcel, getalldata, filtereddata, updatedata, getfiltersdata, deleteall, statusupdate }