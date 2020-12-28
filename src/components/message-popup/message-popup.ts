import './message-popup.css';

class MessagePopup {
    private place: HTMLDivElement;

    private queue: number[];

    private counter: number;

    addMessage(message: string, isError = false): void {
        if (this.place === undefined) {
            return;
        }

        this.counter += 1;
        const newMessage = document.createElement('div');
        newMessage.classList.add('message-popup__message');
        if (isError) {
            newMessage.classList.add('message-popup__error');
        } else {
            newMessage.classList.add('message-popup__accept');
        }
        newMessage.innerText = message;
        newMessage.id = `id${this.counter}`;

        this.place.insertAdjacentElement('afterbegin', newMessage);
        newMessage.addEventListener('click', this.clickMessage);
        this.queue.push(this.counter);
        window.setTimeout(() => {
            const tmpElement = document.getElementById(`id${this.pop()}`);
            tmpElement.removeEventListener('click', this.clickMessage);
            if (tmpElement) {
                this.place.removeChild(tmpElement);
            }
        }, 3000);
    }

    private clickMessage = (event: Event): void => {
        (<Element>event.target).classList.add('message-popup__display-none');
    };

    init(place: HTMLDivElement): void {
        this.place = place;
        this.counter = 0;
        this.queue = [];
        this.place.className = 'message-popup__container';
    }

    private pop(): number {
        if (this.queue.length === 0) {
            return -1;
        }
        const tmp = this.queue[0];
        this.queue = this.queue.slice(1, this.queue.length);
        return tmp;
    }

    deactivate(): void {
        if (this.place === undefined) {
            return;
        }

        this.place.innerHTML = '';
    }
}

export default new MessagePopup();
