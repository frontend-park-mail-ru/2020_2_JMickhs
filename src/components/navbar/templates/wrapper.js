import navbarTemplate from '@navbar/templates/navbarTemplate.hbs';

/**
* Обертка над шаблоном, чтобы не ругался ts
* @param {Object} data - модель
* @return {string} - результат шаблониазтора
*/
function navTemplate(data) {
    const template = navbarTemplate(data);
    return template;
}

export default navTemplate;
