module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Photos', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      url: { type: Sequelize.STRING, allowNull: false },
      entryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Entries', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Photos');
  }
};