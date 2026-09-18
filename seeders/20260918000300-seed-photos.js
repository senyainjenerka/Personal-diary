module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('Photos', [
      { id: 1, url: '/photos/park.jpg', entryId: 1, createdAt: now, updatedAt: now },
      { id: 2, url: '/photos/coffee.jpg', entryId: 2, createdAt: now, updatedAt: now },
      { id: 3, url: '/photos/route.jpg', entryId: 4, createdAt: now, updatedAt: now }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Photos', null, {});
  }
};