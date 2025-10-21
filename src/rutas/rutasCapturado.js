const express = require('express');
const enrutador = express.Router();
const pokemonCapturado = require('../controladores/capturadoControlador');


enrutador.post('/', pokemonCapturado.capturarPokemon); 
enrutador.get('/:usuarioCedula', pokemonCapturado.listarPokemonesUsuario); 

module.exports = enrutador;