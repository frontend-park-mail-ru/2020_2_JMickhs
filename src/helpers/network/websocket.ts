import Events from '@eventbus/eventbus';
import { WEBSOCKET_GET_MESSAGE } from '@eventbus/constants';
import redirector from '@router/redirector';

export default class CustomWebSocket {
    private webSocket: WebSocket;

    constructor(url: string) {
        this.webSocket = new WebSocket(url);

        this.webSocket.addEventListener('message', this.onMessageHandler);
        this.webSocket.addEventListener('close', this.onCloseHandler);
        this.webSocket.addEventListener('error', this.onErrorHandler);
    }

    send(message: string): void {
        this.webSocket.send(message);
    }

    close(code = 1000, message = 'Work is done'): void {
        this.webSocket.close(code, message);
    }

    private onCloseHandler = (event: CloseEvent):void => {
        // eslint-disable-next-line no-console
        console.log(event.code, event.reason, event.target, event.wasClean);
    };

    private onMessageHandler = (event: MessageEvent):void => {
        Events.trigger(WEBSOCKET_GET_MESSAGE, event.data);
    };

    private onErrorHandler = (event: ErrorEvent):void => {
        redirector.redirectError(event.error);
    };
}
