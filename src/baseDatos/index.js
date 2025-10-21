// Archivo: baseDatos/index.js (COMPLETO)

require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

// --- 1. Importación de Modelos ---
const definePokemon = require('../modelos/pokemon');
const defineUsuario = require('../modelos/usuario');
const definePokemonCapturado = require('../modelos/pokemonCapturado'); 

// --- 2. Configuración de la Conexión ---
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false // Opcional: Desactiva el log de SQL en consola
    }
);

// --- 3. Definición de Modelos ---
const Usuario = defineUsuario(sequelize, DataTypes);
const Pokemon = definePokemon(sequelize, DataTypes);
// Usamos 'Capturado' para mantener la consistencia con el controlador
const Capturado = definePokemonCapturado(sequelize, DataTypes); 


// --- 4. Definición de Asociaciones (El paso que faltaba y resuelve el Error 500) ---

/**
 * 💡 Nota: Las siguientes relaciones son NECESARIAS para que el controlador
 * pueda usar 'include: [{ model: Pokemon }]' y el filtro por usuario.
 */

// Capturado pertenece a Pokémon (Necesario para el JOIN y obtener el nombre)
Capturado.belongsTo(Pokemon, { 
    foreignKey: 'pokemonId' 
});

// Capturado pertenece a Usuario
Capturado.belongsTo(Usuario, { 
    foreignKey: 'usuarioCedula' 
});

// Relaciones inversas (Opcional, pero buena práctica)
Pokemon.hasMany(Capturado, { foreignKey: 'pokemonId' });
Usuario.hasMany(Capturado, { foreignKey: 'usuarioCedula' });


// --- 5. Autenticación y Sincronización ---

sequelize.authenticate()
    .then(() => console.log('✅ Conectado a la base de datos.'))
    .catch(err => console.error('❌ No se pudo conectar a la base de datos:', err));

// Sincroniza los modelos con la base de datos, creando o modificando tablas
// { alter: true } crea claves foráneas y modifica tablas existentes sin eliminar datos.
sequelize.sync({ alter: true, force: false }) 
    .then(() => console.log('✨ Sincronización completada.'))
    .catch(err => console.error('❌ Error en la sincronización:', err));

// --- 6. Exportación de Modelos y Sequelize ---
module.exports = {
    Usuario,
    Pokemon,
    Capturado, // Exportado como 'Capturado' para coincidir con el controlador
    sequelize
};