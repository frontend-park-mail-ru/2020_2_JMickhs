import PageView from '@basic/pageView';
import homePageTemplate from '@home/templates/templateHome.hbs';

/** Класс представления для домашней страницы */
export default class HomeView extends PageView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        super(parent);
    }
    /**
     * Отрисовка домашней страницы
     */
    render() {
        this.page.innerHTML = homePageTemplate();
    }
    /**
     * Скрытие домашней страницы
     */
    hide() {
        this.page.innerHTML = '';
    }
}
