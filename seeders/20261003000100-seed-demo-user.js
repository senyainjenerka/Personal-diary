const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const password = process.env.DEMO_USER_PASSWORD;
    if (!password) {
      throw new Error('DEMO_USER_PASSWORD must be set before running the seed');
    }

    const now = new Date();
    const passwordHash = await bcrypt.hash(password, 10);
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [users] = await queryInterface.sequelize.query(
        'INSERT INTO "Users" ("email", "passwordHash", "failedLoginAttempts", "lockUntil", "createdAt", "updatedAt") VALUES (:email, :passwordHash, 0, NULL, :createdAt, :updatedAt) RETURNING "id"',
        {
          replacements: { email: 'demo@diary.local', passwordHash, createdAt: now, updatedAt: now },
          transaction
        }
      );

      
      await queryInterface.bulkUpdate('Entries', { userId: users[0].id }, { id: [1, 2, 3, 4] }, { transaction });
    });
  },
  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      const [users] = await queryInterface.sequelize.query(
        'SELECT "id" FROM "Users" WHERE "email" = :email',
        { replacements: { email: 'demo@diary.local' }, transaction }
      );
      if (users[0]) {
        await queryInterface.bulkUpdate('Entries', { userId: null }, { userId: users[0].id }, { transaction });
        await queryInterface.bulkDelete('Users', { id: users[0].id }, { transaction });
      }
    });
  }
};