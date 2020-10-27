/** Eventbus */
class EventBus {
    /**
     * Создает экземпляр EvenBus
     */
    constructor() {
        this.events = {};
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
        if (!this.events[evt]) {
            return;
        }
        this.events[evt] = this.events[evt].filter((callback) => {
            return callback !== listener;
        });
    }
    /**
     * Отписка от события
     * @param {string} evt - имя события
     */
    unsubscribeAll(evt) {
        this.events[evt] = [];
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

export default new EventBus;
