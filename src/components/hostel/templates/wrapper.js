import hostelCard from '@hostel/templates/hostelCard.hbs';

/**
* Обертка над шаблоном, чтобы не ругался ts
* @param {Object} data - модель
* @return {string} - результат шаблониазтора
*/
export function hostelCardTemplate(data) {
    return hostelCard(data);
}
