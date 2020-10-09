/**
 * Eventbus
 */
class EventBus {
    /**
     * Создает экземпляр EvenBus
     */
    constructor() {
        this.events = {}; // храним евенты
    }
    /**
     * Подписка на событие
     * @param {string} evt - имя события
     * @param {function} listener - функция, которая вызовется при событии
     */
    subscribe(evt, listener) {
        (this.events[evt] || (this.events[evt] = [])).push(listener);
    }
    /**
     * Отписка от события
     * @param {string} evt - имя события
     * @param {function} listener - функция, которая вызовется при событии
     */
    unsubscribe(evt, listener) {
        this.events[evt] = this.events[evt].filter((callback) => {
            return callback !== listener;
        });
    }
    /**
     * Вызывает обработчиков события
     * @param {string} evt - имя события
     * @param {Object?} arg - контекст события
     */
    trigger(evt, arg = null) {
        (this.events[evt] || []).slice().forEach((lsn) => lsn(arg));
    }
}

const Events = new EventBus;
export default Events;
