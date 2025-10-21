const { Capturado, Usuario, Pokemon } = require('../baseDatos'); 

const capturarPokemon = async (req, res) => {
    try {
        const { usuarioCedula, pokemonId } = req.body;

        // Validaciones básicas
        if (!usuarioCedula || !pokemonId) {
            return res.status(400).json({ mensaje: "Faltan Cédula de usuario o ID de Pokémon.", resultado: null });
        }

        // VERIFICACIÓN 1: ¿Existe el Usuario?
        const usuario = await Usuario.findByPk(usuarioCedula);
        if (!usuario) {
            return res.status(404).json({ mensaje: `Usuario con cédula ${usuarioCedula} no encontrado.`, resultado: null });
        }

        // VERIFICACIÓN 2: ¿Existe el Pokémon?
        const pokemon = await Pokemon.findByPk(pokemonId);
        if (!pokemon) {
            return res.status(404).json({ mensaje: `Pokémon con ID ${pokemonId} no encontrado.`, resultado: null });
        }

        // Creación del registro
        const capturado = await Capturado.create(req.body);
        
        // Mensaje más informativo
        res.status(201).json({ mensaje: `Pokemon capturado: ${pokemon.nombre} por ${usuario.nombre}.`, resultado: capturado });
        
    } catch (error) {
        console.error("Error en capturarPokemon:", error.message);
        res.status(500).json({ mensaje: "Error interno al capturar el Pokémon.", resultado: null });
    }
};

/**
 * Lista los Pokémon capturados por un usuario.
 */
const listarPokemonesUsuario = async (req, res) => {
    try {
        const { usuarioCedula } = req.params;
        
        // 1. Buscar las capturas, incluyendo la información del Pokémon asociado
        const capturas = await Capturado.findAll({
            where: { usuarioCedula },
            include: [{
                model: Pokemon, // <-- Esto requiere que las asociaciones estén en index.js
                attributes: ['nombre', 'tipo'] 
            }],
            // Ordenamos por 'createdAt' que es el campo timestamp por defecto
            order: [['createdAt', 'DESC']] 
        });
        
        // 2. Formatear el resultado para que el frontend obtenga los campos esperados
        const resultadoFormateado = capturas.map(c => ({
            cedula: c.usuarioCedula, 
            pokemonId: c.pokemonId,
            nombrePokemon: c.Pokemon ? c.Pokemon.nombre : 'Desconocido', 
            // Usamos c.createdAt para la fecha
            fechaCaptura: c.createdAt ? c.createdAt.toLocaleDateString() : 'N/A'
        }));

        res.status(200).json({ mensaje: "Lista de Pokémon capturados", resultado: resultadoFormateado });
    } catch (error) {
        // Este catch captura el Error 500 si la asociación no está definida
        console.error("Error en listarPokemonesUsuario:", error.message);
        res.status(500).json({ mensaje: "Error interno al listar los Pokémon capturados.", resultado: null });
    }
};

module.exports = {
    capturarPokemon,
    listarPokemonesUsuario
};