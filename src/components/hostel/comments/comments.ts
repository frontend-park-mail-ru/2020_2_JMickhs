import NetworkHostel from '@/helpers/network/network-hostel';
import type { CommentData } from '@/helpers/network/structs-server/comment-data';
import type PageInfo from '@/helpers/network/structs-server/page-info';

import * as template from '@hostel/comments/comments.hbs';
import Redirector from '@router/redirector';
import type { AbstractComponent } from '@interfaces/components';
import type { HandlerEvent } from '@interfaces/functions';
import type { ResponseData } from '@/helpers/network/structs-server/respose-data';

export default class CommentsComponent implements AbstractComponent {
    private place: HTMLDivElement;

    private nextButton?: HTMLButtonElement;

    private prevButton?: HTMLButtonElement;

    private idHostel: number;

    private comment: CommentData;

    private countComments: number;

    private handlers: Record<string, HandlerEvent>;

    private nextUrl: string;

    private prevUrl: string;

    constructor() {
        this.handlers = this.makeHandlers();
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(idHostel: number): void {
        if (!this.place) {
            return;
        }

        this.idHostel = idHostel;
        this.getComment();
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.place.innerHTML = '';
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            nextComment: (event: Event): void => {
                event.preventDefault();

                this.getComment(this.nextUrl);
            },
            prevComment: (event: Event): void => {
                event.preventDefault();

                this.getComment(this.prevUrl);
            },
        };
    }

    private getComment(url?: string): void {
        let response: Promise<ResponseData>;
        if (url) {
            response = NetworkHostel.getCommentsFromUrl(url);
        } else {
            response = NetworkHostel.getComments(0, 1, this.idHostel);
        }

        response.then((value) => {
            const { code } = value;
            const data = value.data as {
                comments: CommentData[],
                pag_info: PageInfo,
            };
            const comment = data.comments[0];
            switch (code) {
                case 200:
                    this.comment = comment;
                    this.countComments = data.pag_info.items_count;
                    this.nextUrl = data.pag_info.next;
                    this.prevUrl = data.pag_info.prev;
                    this.unsubscribeEvents();
                    this.render();
                    this.subscribeEvents();
                    break;
                case 400:
                    Redirector.redirectError('bad request');
                    break;
                case 403:
                    Redirector.redirectError('Нет csrf');
                    break;
                case 423:
                    Redirector.redirectError('Второй раз ставите оценку!');
                    break;
                default:
                    Redirector.redirectError(`Ошибка сервера: статус - ${code}`);
                    break;
            }
        });
    }

    private render(): void {
        this.place.innerHTML = template({ switch: this.countComments > 1, comment: this.comment });

        this.nextButton = document.getElementById('comment-next') as HTMLButtonElement;
        this.prevButton = document.getElementById('comment-prev') as HTMLButtonElement;
    }

    private subscribeEvents(): void {
        this.nextButton?.addEventListener('click', this.handlers.nextComment);
        this.prevButton?.addEventListener('click', this.handlers.prevComment);
    }

    private unsubscribeEvents(): void {
        this.nextButton?.removeEventListener('click', this.handlers.nextComment);
        this.prevButton?.removeEventListener('click', this.handlers.prevComment);
    }
}
