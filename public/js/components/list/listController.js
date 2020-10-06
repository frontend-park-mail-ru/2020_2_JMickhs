import ListModel from './listModel';
import ListView from './listView';

/** Класс контроллера для страницы списка отелей */
export default class ListController {
  /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
  constructor(parent) {
    this._model = new ListModel();
    this._view = new ListView(parent, this._model);
  }
  /**
     * Заполнение данных модели с сервера
     */
  activate() {
    this._model.getInfo();
  }
}
