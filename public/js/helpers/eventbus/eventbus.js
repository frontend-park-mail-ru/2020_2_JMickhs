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
