module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert('Entries', [
      { id: 1, title: 'Прогулка в парке', content: 'Сегодня долго гулял в парке и читал книгу на скамейке.', date: '2026-09-01', mood: 'happy', isPrivate: true, location: 'Городской парк', createdAt: now, updatedAt: now },
      { id: 2, title: 'Новый учебный проект', content: 'Начал разрабатывать REST API для личного дневника.', date: '2026-09-02', mood: 'focused', isPrivate: false, location: 'Дом', createdAt: now, updatedAt: now },
      { id: 3, title: 'Тихий вечер', content: 'Вечером слушал музыку и планировал задачи на завтра.', date: '2026-09-03', mood: 'neutral', isPrivate: true, location: 'Дом', createdAt: now, updatedAt: now },
      { id: 4, title: 'Планы на поездку', content: 'Составил маршрут и список мест, которые хочу посетить.', date: '2026-09-04', mood: 'excited', isPrivate: false, location: 'Кафе', createdAt: now, updatedAt: now }
    ]);
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Entries', null, {});
  }
};