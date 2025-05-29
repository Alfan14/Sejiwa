export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assessment_recomendations', {
      question_id: {
         type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'assessment_questions',
            schema: 'schema',
          },
          key: 'id',
        },
        allowNull: true,
      },
      recomendation_id: {
         type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'recomendations',
            schema: 'schema',
          },
          key: 'id',
        },
        allowNull: true,
      },
      weight : {
        type : Sequelize.DataTypes.INTEGER,
        allowNull: true,
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('assessment_recomendations');
  }
};
