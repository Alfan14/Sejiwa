export default (sequelize, DataTypes) => {
    const Message = sequelize.define( "message", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        consultation_id: {
            unique: true,
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sender_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {timestamps: true}, )
    return Message
 }