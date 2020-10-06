/**
 * Eventbus
 */
export default class EventBus {
    constructor() {
        this.events = {}; // храним евенты
    }
    //добавляем евенты
    subscribe(evt, listener) {
        (this.events[evt] || (this.events[evt] = [])).push(listener);
        return this;
    }

    //триггерим выполнение евентов
    trigger(evt, arg = null) {
        (this.events[evt] || []).slice().forEach(lsn => lsn(arg));
    }
}