module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EntryTag', {
      entryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Entries', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'Tags', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('EntryTag');
  }
};