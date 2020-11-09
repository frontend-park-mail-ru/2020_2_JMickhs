import { CommentData } from '@/helpers/network/structsServer/comment-data';

import Events from '@evenbus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
    AUTH_USER,
} from '@evenbus/constants';
import Redirector from '@router/redirector';

import * as templateUser from '@hostel/comment-user/comment-user.hbs';
import NetworkHostel from '@/helpers/network/network-hostel';
import User from '@user/user';
import { UserData } from '@/helpers/interfaces/structsData/user-data';
import { AbstractComponent } from '@interfaces/components';
import { HandlerEvent } from '@interfaces/functions';

export default class CommentUserComponent implements AbstractComponent {
    private place: HTMLDivElement;

    private comment?: CommentData;

    private idHostel: number;

    private addButton: HTMLButtonElement;

    private editButton: HTMLButtonElement;

    private textArea: HTMLTextAreaElement;

    private selectRating: HTMLSelectElement;

    private handlers: Record<string, HandlerEvent>;

    constructor() {
        this.handlers = this.makeHandlers();
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(idHostel: number, comment?: CommentData): void {
        if (!this.place) {
            return;
        }

        this.idHostel = idHostel;
        this.comment = comment;

        this.render();

        this.subscribeEvents();
    }

    deactivate(): void {
        this.place.innerHTML = '';

        this.unsubscribeEvents();
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            addComment: (event: Event): void => {
                event.preventDefault();

                this.addComment(this.idHostel, this.textArea.value, +this.selectRating.value);
            },
            editComment: (event: Event): void => {
                event.preventDefault();

                if (this.textArea.value === this.comment.message && +this.selectRating.value === this.comment.rating) {
                    return;
                }

                this.editComment(this.comment.comm_id, this.textArea.value, +this.selectRating.value);
            },
            userAppear: (user: UserData): void => {
                if (user) {
                    this.render();
                }
            },
        };
    }

    private render(): void {
        this.place.innerHTML = templateUser({ isAuth: User.getInstance().isAuth, comment: this.comment });

        this.addButton = document.getElementById('button-add-comment') as HTMLButtonElement;
        this.editButton = document.getElementById('button-edit-comment') as HTMLButtonElement;
        this.textArea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
        this.selectRating = document.getElementById('select-rating') as HTMLSelectElement;
    }

    private subscribeEvents(): void {
        Events.subscribe(AUTH_USER, this.handlers.userAppear);

        if (this.addButton) {
            this.addButton.addEventListener('click', this.handlers.addComment);
        }

        if (this.editButton) {
            this.editButton.addEventListener('click', this.handlers.editComment);
        }
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(AUTH_USER, this.handlers.userAppear);

        if (this.addButton) {
            this.addButton.removeEventListener('click', this.handlers.addComment);
        }
        if (this.editButton) {
            this.editButton.removeEventListener('click', this.handlers.editComment);
        }
    }

    private addComment(idHostel: number, message: string, rate: number): void {
        const response = NetworkHostel.addComment(idHostel, message, rate);

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as {
                        new_rate: number,
                        comment: CommentData;
                    };
                    this.comment = data.comment;
                    Events.trigger(UPDATE_RATING_HOSTEL, { rating: data.new_rate, delta: 1 });

                    this.addButton.removeEventListener('click', this.handlers.addComment);
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

    private editComment(idComment: number, message: string, rating: number): void {
        const response = NetworkHostel.editComment(idComment, message, rating);

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as {
                        new_rate: number,
                        comment: CommentData;
                    };
                    this.comment = data.comment;
                    Events.trigger(UPDATE_RATING_HOSTEL, { rating: data.new_rate, delta: 0 });
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
}
