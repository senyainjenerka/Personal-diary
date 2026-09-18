module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Entries', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      title: { type: Sequelize.STRING, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false, defaultValue: Sequelize.literal('CURRENT_DATE') },
      mood: { type: Sequelize.STRING },
      isPrivate: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Entries');
  }
};