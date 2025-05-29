export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      schedule_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'schedules',
            schema: 'schema',
          },
          key: 'id',
        },
        allowNull: false,
      },
      student_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'schema',
          },
          key: 'id',
        },
        allowNull: false,
      },
      status: {
        type: Sequelize.VARCHAR
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('bookings');
  }
};
