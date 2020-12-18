import Events from '@eventbus/eventbus';

import * as chatTemplate from '@chat/templates/chatTemplate.hbs';
import * as messageTemplate from '@chat/templates/messageTemplate.hbs';
import '@chat/templates/chat.css';
import {
    WEBSOCKET_GET_MESSAGE,
} from '@eventbus/constants';
import CustomWebSocket from '@network/websocket';
import type { AbstractComponent } from '@interfaces/components';

const WEBSOCKET_URL = 'wss://hostelscan.ru:8080/api/v1/ws/chat';

export default class Chat implements AbstractComponent {
    private place?: HTMLElement;

    private sendButton: HTMLButtonElement;

    private messageContainer: HTMLDivElement;

    private inputElement: HTMLInputElement;

    private socket: CustomWebSocket;

    constructor() {
        this.socket = new CustomWebSocket(WEBSOCKET_URL);
    }

    private subscribeEvents(): void {
        Events.subscribe(WEBSOCKET_GET_MESSAGE, this.renderNewMessage);

        this.sendButton.addEventListener('click', this.sendNewMessage);
    }

    private unsubscribeEvents(): void {
        this.sendButton.removeEventListener('click', this.sendNewMessage);
        Events.unsubscribe(WEBSOCKET_GET_MESSAGE, this.renderNewMessage);
    }

    private renderNewMessage = (message: string): void => {
        this.messageContainer.innerHTML += messageTemplate({
            message,
            user: false,
        });
    };

    private sendNewMessage = (): void => {
        const message = this.inputElement.value;
        this.socket.send(message);

        this.messageContainer.innerHTML += messageTemplate({
            message,
            user: true,
        });

        this.inputElement.value = '';
    };

    render(): void {
        window.scrollTo(0, 0);
        this.place.innerHTML = chatTemplate();

        this.sendButton = document.getElementById('send-button') as HTMLButtonElement;
        this.messageContainer = document.getElementById('message-container') as HTMLDivElement;
        this.inputElement = document.getElementById('chat-input') as HTMLInputElement;

        this.subscribeEvents();
    }

    hide(): void {
        if (this.place.innerHTML === '') {
            return;
        }
        this.unsubscribeEvents();

        this.place.innerHTML = '';
    }

    activate():void {
        if (!this.place) {
            return;
        }

        this.render();
        this.subscribeEvents();
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.hide();
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }
}
