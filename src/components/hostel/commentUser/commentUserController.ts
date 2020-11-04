import { AbstractController } from '@interfaces/controllers';
import { CommentData } from '@network/structsServer/commentData';

import Events from '@eventBus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
    HAVE_USER,
} from '@eventBus/constants';
import Redirector from '@/helpers/router/redirector';

import * as templateUser from '@hostel/templates/hostelComment.hbs';
import NetworkHostel from '@network/networkHostel';
import User from '@/helpers/user/user';
import { UserData } from '@interfaces/structsData/userData';

export default class CommentUserController implements AbstractController {
    private place: HTMLDivElement;

    private comment?: CommentData;

    private idHostel: number;

    private btnAdd: HTMLElement;

    private btnEdit: HTMLElement;

    private textArea: HTMLTextAreaElement;

    private selectRating: HTMLSelectElement;

    private handlers: Record<string, (arg: unknown) => void>;

    constructor(place: HTMLDivElement) {
        this.place = place;

        this.handlers = this.makeHandlers();
    }

    activate(idHostel: number, comment?: CommentData): void {
        this.idHostel = idHostel;
        this.comment = comment;

        this.render();

        this.subscribeEvents();
    }

    deactivate(): void {
        this.place.innerHTML = '';

        this.unsubscribeEvents();
    }

    private makeHandlers(): Record<string, (arg: unknown) => void> {
        return {
            addComment: (evt: Event) => {
                evt.preventDefault();

                this.addComment(this.idHostel, this.textArea.value, +this.selectRating.value);
            },
            editComment: (evt: Event) => {
                evt.preventDefault();

                if (this.textArea.value === this.comment.message && +this.selectRating.value === this.comment.rating) {
                    return;
                }

                this.editComment(this.comment.comm_id, this.textArea.value, +this.selectRating.value);
            },
            haveUser: (user: UserData) => {
                if (user) {
                    this.render();
                }
            },
        };
    }

    private render(): void {
        this.place.innerHTML = templateUser({ isAuth: User.getInstance().isAuth, comment: this.comment });

        this.btnAdd = document.getElementById('btn-add-comment');
        this.btnEdit = document.getElementById('btn-edit-comment');
        this.textArea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
        this.selectRating = document.getElementById('select-rating') as HTMLSelectElement;
    }

    private subscribeEvents(): void {
        Events.subscribe(HAVE_USER, this.handlers.haveUser);

        if (this.btnAdd) {
            this.btnAdd.addEventListener('click', this.handlers.addComment);
        }

        if (this.btnEdit) {
            this.btnEdit.addEventListener('click', this.handlers.editComment);
        }
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(HAVE_USER, this.handlers.haveUser);

        if (this.btnAdd) {
            this.btnAdd.removeEventListener('click', this.handlers.addComment);
        }
        if (this.btnEdit) {
            this.btnEdit.removeEventListener('click', this.handlers.editComment);
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

                    this.btnAdd.removeEventListener('click', this.handlers.addComment);
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
