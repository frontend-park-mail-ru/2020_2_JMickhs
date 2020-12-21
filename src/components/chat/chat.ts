import Events from '@eventbus/eventbus';

import * as chatTemplate from '@chat/templates/chatTemplate.hbs';
import * as messageTemplate from '@chat/templates/messageTemplate.hbs';
import '@chat/templates/chat.css';
import {
    WEBSOCKET_GET_MESSAGE,
} from '@eventbus/constants';
import CustomWebSocket from '@network/websocket';
import NetworkChat from '@network/network-chat';
import type { AbstractComponent } from '@interfaces/components';
import type { MessageData } from '@network/structs-server/message-data';
import Redirector from '@router/redirector';
import {
    ERROR_400,
    ERROR_DEFAULT,
} from '@global-variables/network-error';

const WEBSOCKET_CHAT = 'wss://hostelscan.ru:8080/api/v1/ws/chat';
const WEBSOCKET_URL = 'wss://hostelscan.ru:8080/api/v1/ws';

export default class Chat implements AbstractComponent {
    private place?: HTMLElement;

    private sendButton: HTMLButtonElement;

    private messageContainer: HTMLDivElement;

    private inputElement: HTMLInputElement;

    private socket: CustomWebSocket;

    private inputIdTimer: number;

    constructor() {
        this.inputIdTimer = -1;
    }

    private subscribeEvents(): void {
        Events.subscribe(WEBSOCKET_GET_MESSAGE, this.renderNewMessage);

        this.sendButton.addEventListener('click', this.sendNewMessage);
        window.addEventListener('beforeunload', this.closeSocket);
        this.inputElement.addEventListener('input', this.checkMessageLength);
    }

    private unsubscribeEvents(): void {
        this.sendButton.removeEventListener('click', this.sendNewMessage);
        Events.unsubscribe(WEBSOCKET_GET_MESSAGE, this.renderNewMessage);
        window.removeEventListener('beforeunload', this.closeSocket);
        this.inputElement.removeEventListener('input', this.checkMessageLength);
    }

    private renderNewMessage = (message: string): void => {
        this.messageContainer.innerHTML += messageTemplate([{
            message,
            user: false,
        }]);
    };

    private sendNewMessage = (): void => {
        const message = this.inputElement.value;
        if (message.length === 0) {
            return;
        }
        this.socket.send(message);

        this.messageContainer.innerHTML += messageTemplate([{
            message,
            user: true,
        }]);

        this.inputElement.value = '';
    };

    private checkMessageLength = (): void => {
        const message = this.inputElement.value;
        if (message.length < 70) {
            return;
        }
        this.inputElement.value = message.slice(0, 70);
        if (this.inputIdTimer !== -1) {
            window.clearTimeout(this.inputIdTimer);
            this.inputElement.classList.remove('chat__input-error');
        }

        this.inputElement.classList.add('chat__input-error');
        this.inputIdTimer = window.setTimeout(() => {
            if (this.inputElement) {
                this.inputElement.classList.remove('chat__input-error');
            }
            this.inputIdTimer = -1;
        }, 1000);
    };

    private closeSocket = (): void => {
        this.socket.close();
    };

    private render(messages: MessageData[] = undefined): void {
        window.scrollTo(0, 0);
        this.place.innerHTML = chatTemplate();

        this.sendButton = document.getElementById('send-button') as HTMLButtonElement;
        this.messageContainer = document.getElementById('message-container') as HTMLDivElement;
        this.inputElement = document.getElementById('chat-input') as HTMLInputElement;

        if (messages) {
            this.messageContainer.innerHTML += messageTemplate(messages);
        }
        this.subscribeEvents();
    }

    hide(): void {
        if (this.place.innerHTML === '') {
            return;
        }
        this.unsubscribeEvents();

        this.place.innerHTML = '';
    }

    activate(params?: URLSearchParams):void {
        if (!this.place) {
            return;
        }

        const response = NetworkChat.getHistory(params);

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const serverMessages = value.data as [{ Message: string, Moderator: boolean }] || [];
                    const messages: MessageData[] = [];
                    serverMessages.forEach((message) => {
                        messages.push({ message: message.Message, user: !message.Moderator });
                    });
                    this.render(messages);

                    if (params) {
                        this.socket = new CustomWebSocket(`${WEBSOCKET_URL}?${params.toString()}`);
                    } else {
                        this.socket = new CustomWebSocket(WEBSOCKET_CHAT);
                    }
                    break;
                case 401:
                    if (params) {
                        this.render();
                        this.socket = new CustomWebSocket(`${WEBSOCKET_URL}?${params.toString()}`);
                    } else {
                        Redirector.redirectTo('/signin');
                    }
                    break;
                case 400:
                    Redirector.redirectError(ERROR_400);
                    break;
                default:
                    Redirector.redirectError(`${ERROR_DEFAULT}${code || value.error}`);
                    break;
            }
        });
    }

    deactivate(): void {
        if (this.place.innerHTML === '') {
            return;
        }

        this.socket.close();
        this.unsubscribeEvents();
        this.hide();
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }
}
