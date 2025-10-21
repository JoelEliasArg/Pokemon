const { Pokemon } = require('../baseDatos'); 


const registrarPokemon = async (req, res) => {
    try {
        
        const { nombre, tipo, nivel } = req.body;
        
        
        if (!nombre || !tipo || !nivel) {
            return res.status(400).json({ mensaje: "Faltan campos requeridos: nombre, tipo y nivel.", resultado: null });
        }
        
        const pokemonExistente = await Pokemon.findOne({
            where: {
                nombre: nombre
            }
        });

        if (pokemonExistente) {
            return res.status(400).json({ mensaje: "El pokemon ya existe", resultado: null });
        }


        const nuevoPokemon = await Pokemon.create({ 
            nombre, 
            tipo, 
            nivel: parseInt(nivel) 
        });
        
        res.status(201).json({ mensaje: "Pokemon creado", resultado: nuevoPokemon });
    } catch (error) {
        console.error('Error al registrar Pokémon:', error);
        res.status(500).json({ mensaje: "Error interno del servidor al registrar el Pokémon.", resultado: null });
    }
};


const listarPokemones = async (req, res) => {
    try {
        const pokemones = await Pokemon.findAll({
            order: [['nombre', 'ASC']] 
        });
        
        res.status(200).json({ mensaje: "Lista de Pokémon", resultado: pokemones });
    } catch (error) {
        console.error('Error al listar Pokémon:', error);
        res.status(500).json({ mensaje: "Error interno del servidor al listar los Pokémon.", resultado: null });
    }
};

module.exports = {
    registrarPokemon,
    listarPokemones
};