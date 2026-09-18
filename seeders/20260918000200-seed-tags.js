module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('Tags', [
      { id: 1, name: 'путешествия', createdAt: now, updatedAt: now },
      { id: 2, name: 'работа', createdAt: now, updatedAt: now },
      { id: 3, name: 'личное', createdAt: now, updatedAt: now },
      { id: 4, name: 'учёба', createdAt: now, updatedAt: now },
      { id: 5, name: 'отдых', createdAt: now, updatedAt: now }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Tags', null, {});
  }
};