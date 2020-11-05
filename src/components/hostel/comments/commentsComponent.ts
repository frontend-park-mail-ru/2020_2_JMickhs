import NetworkHostel from '@network/networkHostel';
import { CommentData } from '@network/structsServer/commentData';
import PageInfo from '@network/structsServer/pageInfo';

import * as template from '@hostel/templates/hostelComments.hbs';
import Redirector from '@router/redirector';
import { AbstractComponent } from '@interfaces/components';
import { HandlerEvent } from '@interfaces/functions';

export default class CommentsComponent implements AbstractComponent {
    private place: HTMLDivElement;

    private nextButton: HTMLButtonElement;

    private prevButton: HTMLButtonElement;

    private idHotel: number;

    private pageNumber: number;

    private comment: CommentData;

    private countComments: number;

    private handlers: Record<string, HandlerEvent>;

    private subscribesBtn: boolean;

    constructor(place : HTMLDivElement) {
        this.place = place;

        this.handlers = this.makeHandlers();
    }

    activate(idHostel: number): void {
        this.idHotel = idHostel;
        this.pageNumber = 0;
        this.subscribesBtn = false;

        this.getComment();
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.place.innerHTML = '';
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            nextComment: (event: Event) => {
                event.preventDefault();

                if (this.pageNumber === this.countComments) {
                    this.pageNumber = 0;
                }

                this.getComment();
            },
            prevComment: (event: Event) => {
                event.preventDefault();

                this.pageNumber -= 2;

                if (this.pageNumber < 0) {
                    this.pageNumber = this.countComments - 1;
                }

                this.getComment();
            },
        };
    }

    private getComment(): void {
        const response = NetworkHostel.getComments(this.pageNumber, this.idHotel);

        response.then((value) => {
            const { code } = value;
            const data = value.data as {
                list: CommentData[],
                pag_info: PageInfo,
            };
            const comment = data.list[0];
            switch (code) {
                case 200:
                    this.comment = comment;
                    this.countComments = data.pag_info.num_pages;
                    this.pageNumber = data.pag_info.page_num;
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

    private render() {
        this.place.innerHTML = template({ switch: this.countComments > 1, comment: this.comment });

        this.nextButton = document.getElementById('comment-next') as HTMLButtonElement;
        this.prevButton = document.getElementById('comment-prev') as HTMLButtonElement;
    }

    private subscribeEvents(): void {
        if (!this.subscribesBtn && this.nextButton) {
            this.nextButton.addEventListener('click', this.handlers.nextComment);
            this.prevButton.addEventListener('click', this.handlers.prevComment);

            this.subscribesBtn = true;
        }
    }

    private unsubscribeEvents(): void {
        if (this.subscribesBtn) {
            this.nextButton.removeEventListener('click', this.handlers.nextComment);
            this.prevButton.removeEventListener('click', this.handlers.prevComment);

            this.subscribesBtn = false;
        }
    }
}
