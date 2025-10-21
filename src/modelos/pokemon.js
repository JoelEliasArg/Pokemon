const definePokemon = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'nombre'
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        nivel: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            validate: {
                min: 1 
            }
        }
    }, {
        tableName: 'pokemon',
        // Esto automáticamente agrega los campos createdAt y updatedAt
        timestamps: true
    });
};

module.exports = definePokemon;