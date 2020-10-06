import Net from '../../helpers/network/network';
import Events from './../../helpers/eventbus/eventbus';

/** Класс модели для страницы списка отелей */
export default class ListModel {
  /**
     * Инициализация класса
     */
  constructor() {
    this.haveInfo = false;
    this.hostels = [];
  }
  /**
     * Получить список отелей с сервера
     */
  getInfo() {
    const response = Net.getHotels();
    response.then((result) => {
      if (result.status === 200) {
        this.haveInfo = true;
        this.hostels = result.body;
        Events.trigger('loadHostels');
      }
    });
  }
}
