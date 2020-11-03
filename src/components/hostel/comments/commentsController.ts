import { AbstractController } from '@interfaces/controllers';
import NetworkHostel from '@network/networkHostel';
import { CommentData } from '@network/structsServer/commentData';
import PageInfo from '@network/structsServer/pageInfo';

import * as template from '@hostel/templates/hostelComments.hbs';
import Events from '@eventBus/eventbus';
import { REDIRECT_ERROR } from '@eventBus/constants';

export default class CommentsController implements AbstractController {

    private place: HTMLElement;
    private nextBtn: HTMLButtonElement;
    private prevBtn: HTMLButtonElement;

    private idHotel: number;
    private pageNumber: number;
    private comment: CommentData;
    private countComments: number;

    private handlers: Record<string, (arg: unknown) => void>;
    private subscribesBtn: boolean;

    constructor() {
        this.handlers = {
            nextComment: (evt: Event) => {
                evt.preventDefault();

                if (this.pageNumber === this.countComments) {
                    this.pageNumber = 0;
                }

                this.getComments();
            },
            prevComment: (evt: Event) => {
                evt.preventDefault();

                this.pageNumber -= 2;

                if (this.pageNumber < 0) {
                    this.pageNumber = this.countComments - 1;
                }

                this.getComments();
            },
        };
    }

    activate(arg: {place: HTMLElement, idHostel: number}): void {
        this.place = arg.place;
        this.idHotel = arg.idHostel;
        this.pageNumber = 0;
        this.subscribesBtn = false;

        this.getComments();
    }

    private getComments(): void {
        const response = NetworkHostel.getComments(this.pageNumber, this.idHotel);

        response.then((value) => {
            const code = value.code;
            switch (code) {
            case 200:
                const data = value.data as {
                    list: CommentData[],
                    pag_info: PageInfo,
                };
                this.comment = data.list[0];
                this.countComments = data.pag_info.num_pages;
                this.pageNumber = data.pag_info.page_num;
                this.unsubscribeEvents();
                this.render();
                this.subscribeEvents();
                break;
            case 400:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'bad request'});
                break;
            case 403:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Нет csrf'});
                break;
            case 423:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Второй раз ставите ошибку!'});
                break;
            default:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: `Ошибка сервера: статус - ${code}`});
                break;
            }
        });

    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.place.innerHTML = '';
    }

    private render() {
        this.place.innerHTML = template({count: this.countComments, comment: this.comment});

        this.nextBtn = document.getElementById('comment-next') as HTMLButtonElement;
        this.prevBtn = document.getElementById('comment-prev') as HTMLButtonElement;

    }

    private subscribeEvents(): void {
        if (!this.subscribesBtn && this.nextBtn) {

            this.nextBtn.addEventListener('click', this.handlers.nextComment);
            this.prevBtn.addEventListener('click', this.handlers.prevComment);

            this.subscribesBtn = true;
        }
    }

    private unsubscribeEvents(): void {
        if (this.subscribesBtn) {

            this.nextBtn.removeEventListener('click', this.handlers.nextComment);
            this.prevBtn.removeEventListener('click', this.handlers.prevComment);

            this.subscribesBtn = false;
        }
    }

}