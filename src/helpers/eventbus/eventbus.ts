class EvenBus {

    events: Record<string, Array<(arg?: unknown) => void>>;

    constructor() {
        this.events = {};
    }

    subscribe(evt: string, callback: (arg?: unknown) => void): void {
        (this.events[evt] || (this.events[evt] = [])).push(callback);
    }

    unsubscribe(evt: string, callback: (arg?: unknown) => void): void {
        if (!this.events[evt]) {
            return;
        }
        this.events[evt] = this.events[evt].filter((func) => {
            return func !== callback;
        });
    }

    trigger(evt: string, arg?: unknown) {
        (this.events[evt] || []).slice().forEach((lsn) => lsn(arg));
    }

}

export default new EvenBus();