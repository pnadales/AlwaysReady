const { Pool } = require("pg");
require('dotenv').config();
const { text } = require("stream/consumers");
const { measureMemory } = require("vm");

const dbpw = process.env.DB_PW;
// Configuración de la base de datos usando string de conexion
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "always_music",
    password: dbpw,
    port: 5432
});

// manejo del process.argv
const argumentos = process.argv.slice(2);
// posicion 0 funcion a usar
const funcion = argumentos[0];
// console.log(argumentos)

function otrosErrores(e) {
    let message;
    if (e.code = 'ECONNREFUSED') {
        message = 'Error en el puerto ingresado'
    } else if (e.code == 'ENOTFOUND') {
        message = 'Error de host'
    } else {
        message = e.message
    }
    return message;
}


//Crear funcion para registrar estudiantes
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
        console.log("Hubo un error:", otrosErrores(error));
    };
    await pool.end();
};

// Crear una función asíncrona para obtener por consola el registro de un estudiante por medio de su rut
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

//Crear funcion para consultar estudiantes registrados
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

// Crear una función asíncrona para actualizar los datos de un estudiante en la base de datos. 
const actualizarEstud = async (nombre, rut, curso, nivel) => {
    try {
        const query = {
            text: 'UPDATE estudiantes SET rut = $1, curso = $2, nivel = $3 WHERE nombre = $4 RETURNING *',
            values: [rut, curso, nivel, nombre]
        }
        const res = await pool.query(query);
        console.log(`Estudiante ${nombre} modificado con éxito`);
        console.log("Estudiante modificado: ", res.rows[0]);
        await pool.end();
    } catch (error) {
        console.log("Hubo un error:", otrosErrores(error));
    }
};


// Crear una función asíncrona para eliminar el registro de un estudiante de la base de datos. 
const eliminarEstud = async (rut) => {
    try {
        const query = {
            text: 'DELETE FROM estudiantes WHERE rut = $1 RETURNING *',
            values: [rut]
        }
        const res = await pool.query(query);
        console.log(`Estudiante eliminado con éxito`);
        console.log("Estudiante eliminado: ", res.rows[0]);
        await pool.end();
    } catch (error) {
        console.log("Hubo un error:", otrosErrores(error));
    }
};

// eliminarEstud("4444444-4");

//Programar manejo de datos por consola
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