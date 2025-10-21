require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar la conexión y los modelos
const { sequelize } = require('./src/baseDatos'); 

// Importar los controladores
const usuarioControlador = require('./src/controladores/usuarioControlador');
const pokemonControlador = require('./src/controladores/pokemonControlador');
const capturadoControlador = require('./src/controladores/capturadoControlador');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de la API
app.post('/usuario', usuarioControlador.registrarUsuario);
app.get('/usuario', usuarioControlador.listarUsuarios);
app.post('/pokemon', pokemonControlador.registrarPokemon);
app.get('/pokemon', pokemonControlador.listarPokemones);
app.post('/capturado', capturadoControlador.capturarPokemon);
app.get('/capturado/:usuarioCedula', capturadoControlador.listarPokemonesUsuario);
app.put('/usuario/:cedula', usuarioControlador.actualizarUsuario);
app.delete('/usuario/:cedula', usuarioControlador.borrarUsuario);

//archivos estaticos
app.use(express.static('Frontend'));

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);

  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos.');
    await sequelize.sync({ alter: true });
  console.log('✅ Sincronización completada.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
});
