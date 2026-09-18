module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('EntryTag', [
      { entryId: 1, tagId: 3 },
      { entryId: 1, tagId: 5 },
      { entryId: 2, tagId: 2 },
      { entryId: 2, tagId: 4 },
      { entryId: 3, tagId: 3 },
      { entryId: 4, tagId: 1 }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('EntryTag', null, {});
  }
};