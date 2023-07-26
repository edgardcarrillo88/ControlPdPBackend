const xlsx = require('xlsx');
const taskmodel = require('../models/task')
const { format, addMinutes, parseISO } = require('date-fns')


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
            //fechainicio.setMilliseconds(fechainicio.getMilliseconds() + 100);
            // const fechainicioFormateada = format(fechainicio, 'dd/MM/yyyy HH:mm');
            // rowData.inicioplan = fechainicioFormateada;
            console.log(fechainicio);
            rowData.inicioplan = fechainicio.toISOString();
            console.log(rowData.inicioplan);

            console.log(rowData.finplan);
            const fechafin = new Date((rowData.finplan - 25569) * 86400 * 1000);
            fechafin.setMilliseconds(fechafin.getMilliseconds() + 100);
            // fechafin.setMilliseconds(fechafin.getMilliseconds() + 100);
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

    console.log(data);


    console.log(data);
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
    console.log(req.body);
    const { id, comentario, inicio, fin, avance } = req.body

    const [fechainicio, horainicio] = inicio.split('T');
    const [anhoinicio, mesinicio, diainicio] = fechainicio.split('-');
    const [horasinicio, minutosinicio] = horainicio.split(':');
    const newinicio = `${diainicio}-${mesinicio}-${anhoinicio}T${horasinicio}:${minutosinicio}`;

    const [fechafin, horafin] = fin.split('T');
    const [anhofin, mesfin, diafin] = fechafin.split('-');
    const [horasfin, minutosfin] = horafin.split(':');
    const newfinfin = `${diafin}-${mesfin}-${anhofin}T${horasfin}:${minutosfin}`;

    console.log(newinicio);
    console.log(newfinfin);
    const data = await taskmodel.findByIdAndUpdate(id, {
        $set: { comentarios: comentario },
        $set: { inicioreal: newinicio },
        $set: { finreal: newfinfin },
        $set: { avance: avance },
        $set: { curva: "Actual" },
    }, { new: true })
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

module.exports = { uploadexcel, getalldata, filtereddata, updatedata, getfiltersdata, deleteall }