export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assessment_questions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      code: {
        type : Sequelize.DataTypes.VARCHAR,
        allowNull: false,
      },
      label : {
        type : Sequelize.DataTypes.VARCHAR,
        allowNull: false,
      },
      created_at : {
        type : Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updated_at : {
        type : Sequelize.DataTypes.DATE,
        allowNull: false,
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('assessment_questions');
  }
};
