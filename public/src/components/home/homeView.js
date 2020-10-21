import homePageTemplate from './templates/templateHome.hbs';
import BasisView from '../BasisView/BasisView';

/** Класс представления для домашней страницы */
export default class HomeView extends BasisView {
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
