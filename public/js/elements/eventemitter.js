// наследоваться от этого класса в view и model

/**
 * класс эмитирущий евенты
 */
class EventEmitter {
    constructor() {
        this.events = {}; // храним евенты
    }
    //добавляем евенты
    subscribe(evt, listener) {
        (this.events[evt] || (this.events[evt] = [])).push(listener);
        return this;
    }
    //ввыполняем
    do(evt, arg) {
        (this.events[evt] || []).slice().forEach(lsn => lsn(arg));
    }
}
