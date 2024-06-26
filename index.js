const { Pool } = require("pg");
require('dotenv').config();

// Variable de entorno con el password de la base de datos
const dbpw = process.env.DB_PW;

// Configuración de la base de datos
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "always_music",
    password: dbpw,
    port: 5432
});

//Captura de elementos ingresdos por consola
const argumentos = process.argv.slice(2);

//Captura del elemento que contiene la accion a realizar
const funcion = argumentos[0];

//Funcion para mostrar mensaje en errores de host y port
function otrosErrores(e) {
    let message;
    if (e.code = 'ECONNREFUSED' && "" == e.message) {
        message = 'Error en el puerto ingresado'
    } else if (e.code == 'ENOTFOUND') {
        message = 'Error de host'
    } else {
        message = e.message
    }
    return message;
}


//Funcion para registrar estudiantes
const nuevoEstudiante = async (nombre, rut, curso, nivel) => {
    try {
        const query = {
            text: 'INSERT INTO estudiantes values ($1, $2, $3, $4 ) RETURNING *',
            values: [nombre, rut, curso, nivel]
        }
        const res = await pool.query(query);
        console.log(`Estudiante ${nombre} agregado con éxito`);
        console.log("Estudiante agregado: ", res.rows[0]);
    } catch (error) {
        console.log("No se pudo agregar el estudiante, revise los datos ingresados.")
        console.log("Hubo un error:", otrosErrores(error));
    };
    await pool.end();
};

//Función para obtener el registro de un estudiante por medio de su rut
const consultaRut = async (rut) => {
    try {

        const query = {
            text: 'SELECT * FROM estudiantes WHERE rut = $1',
            values: [rut],
            rowMode: "array"
        }
        const res = await pool.query(query);
        // console.log(res);
        if (res.rowCount == 0) {
            console.log("No se encontró ningún estudiante con ese rut");
        } else {
            console.log("Estudiante consultado: ", res.rows[0]);
        }
        await pool.end();
    } catch (error) {
        console.log("Hubo un error:", otrosErrores(error));
    }
};

//Funcion para consultar todos estudiantes registrados
const consultaEstudiante = async () => {
    try {

        const query = {
            text: 'SELECT * FROM estudiantes',
            rowMode: "array"
        }
        const estudiantes = await pool.query(query);
        console.log(estudiantes.rows);
        await pool.end();
    } catch (error) {
        console.log("Hubo un error:", otrosErrores(error));
    }
};

//Funciónpara actualizar los datos de un estudiante en la base de datos. 
const actualizarEstud = async (nombre, rut, curso, nivel) => {
    try {
        const query = {
            text: 'UPDATE estudiantes SET rut = $1, curso = $2, nivel = $3 WHERE nombre = $4 RETURNING *',
            values: [rut, curso, nivel, nombre]
        }
        const res = await pool.query(query);
        if (res.rowCount == 0) {
            console.log("No se encontró el estudiante ingresado");
        } else {
            console.log(`Estudiante ${nombre} modificado con éxito`);
            console.log("Estudiante modificado: ", res.rows[0]);

        }
        await pool.end();
    } catch (error) {
        console.log("Hubo un error:", otrosErrores(error));
    }
};


//Función para eliminar el registro de un estudiante de la base de datos. 
const eliminarEstud = async (rut) => {
    try {
        const query = {
            text: 'DELETE FROM estudiantes WHERE rut = $1 RETURNING *',
            values: [rut]
        }
        const res = await pool.query(query);
        if (res.rowCount == 0) {
            console.log("No se encontró el estudiante ingresado");
        } else {
            console.log(`Estudiante eliminado con éxito`);
            console.log("Estudiante eliminado: ", res.rows[0]);
        }
        await pool.end();
    } catch (error) {
        console.log("Hubo un error:", otrosErrores(error));
    }
};


//Ejecutar la funcion correspondiente 
switch (funcion) {
    case "nuevo":
        nuevoEstudiante(argumentos[1], argumentos[2], argumentos[3], argumentos[4]);
        break;
    case "rut":
        consultaRut(argumentos[1]);
        break;
    case "consulta":
        consultaEstudiante();
        break;
    case "editar":
        actualizarEstud(argumentos[1], argumentos[2], argumentos[3], argumentos[4]);
        break;
    case "eliminar":
        eliminarEstud(argumentos[1]);
        break;
    default:
        console.log("Función no encontrada");
};