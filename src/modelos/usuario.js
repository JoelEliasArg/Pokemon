// Archivo: modelos/usuario.js (CORREGIDO)

const defineUsuario = (sequelize, DataTypes) => {
    return sequelize.define('Usuario', {
        cedula: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            // 💡 CORRECCIÓN: Si ya es primaryKey, 'unique' es opcional, 
            // pero si se usa, mejor usar 'true' o quitarlo.
            // Lo quitamos ya que primaryKey ya implica unicidad. 
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true // 💡 CORRECCIÓN: Usar 'true' aquí.
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        edad: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'usuario',
        timestamps: true
    });
};

module.exports = defineUsuario;