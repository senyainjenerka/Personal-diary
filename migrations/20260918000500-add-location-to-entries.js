module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Entries', 'location', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('Entries', 'location');
  }
};