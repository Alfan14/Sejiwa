export default (sequelize, DataTypes) => {
    const Assesment = sequelize.define( "assesment", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.timestamps,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.timestamps,
            allowNull: false
        },
    }, {timestamps: true}, )
    return Assesment
 }