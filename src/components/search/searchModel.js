import Net from '../../helpers/network/network';
import Events from '../../helpers/eventbus/eventbus';
import {REDIRECT, REDIRECT_ERROR} from '../../helpers/eventbus/constants';

/** Класс модели для страницы вырвиглазного поиска */
export default class SearchModel {
    /**
     * Инициализация класса
     */
    constructor() {
        Events.subscribe('search', (arg) => {
            this.search(arg);
        });
    }
    /**
     * Поиск отелей(запрос на сервер)
     * @param {string} pattern - паттерн поиска
     */
    search(pattern) {
        const response = Net.searchHotels(pattern);
        response.then((response) => {
            const data = response.data;
            const code = response.code;
            switch (code) {
            case 200:
                Events.trigger(REDIRECT, {url: `/list/${pattern}`, data: data.hotels});
                break;
            case 400:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Неверный формат запроса'});
                break;
            }
        });
    }
}
