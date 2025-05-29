export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
       sender_id: {
        type : Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      message : {
        type : Sequelize.DataTypes.VARCHAR,
        allowNull: false,
      },
      timestamp : {
        type : Sequelize.DataTypes.DATE,
        allowNull: false,
      }
     
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('messages');
  }
};
