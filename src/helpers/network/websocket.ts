import Events from '@eventbus/eventbus';
import { WEBSOCKET_GET_MESSAGE } from '@eventbus/constants';

export default class CustomWebSocket {
    private webSocket: WebSocket;

    constructor(url: string) {
        this.webSocket = new WebSocket(url);

        this.webSocket.addEventListener('open', this.onOpenHandler);
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

    private onOpenHandler = ():void => {
        // do something
    };

    private onCloseHandler = (event: CloseEvent):void => {
        // eslint-disable-next-line no-console
        console.log(event.code, event.reason, event.target, event.wasClean);
    };

    private onMessageHandler = (event: MessageEvent):void => {
        Events.trigger(WEBSOCKET_GET_MESSAGE, event.data);
    };

    private onErrorHandler = (event: ErrorEvent):void => {
        // eslint-disable-next-line no-console
        console.log(event.error, event.message, event.target, event.type);
    };
}
