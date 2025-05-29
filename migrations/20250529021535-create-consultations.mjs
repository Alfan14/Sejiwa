export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('consultations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
       consultation_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'consultations',
            schema: 'schema',
          },
          key: 'id',
        },
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      is_available: {
        type : Sequelize.VARCHAR,
      },
      counselor_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'counselor',
            schema: 'schema',
          },
          key: 'id',
        },
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('consultations');
  }
};
