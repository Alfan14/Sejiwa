'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'Alice Example',
        email: 'alice@example.com',
        password: 'hashed_password_1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'Bob Sample',
        email: 'bob@example.com',
        password: 'hashed_password_2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
