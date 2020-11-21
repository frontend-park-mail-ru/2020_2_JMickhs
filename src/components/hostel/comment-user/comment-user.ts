import type { CommentData } from '@/helpers/network/structs-server/comment-data';

import Events from '@eventbus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
    AUTH_USER,
} from '@eventbus/constants';
import Redirector from '@router/redirector';
import NetworkHostel from '@/helpers/network/network-hostel';
import User from '@user/user';
import type { UserData } from '@/helpers/interfaces/structs-data/user-data';
import type { AbstractComponent } from '@interfaces/components';

import './comment-user.css';
import * as templateUser from '@hostel/comment-user/comment-user.hbs';

export default class CommentUserComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private comment?: CommentData;

    private idHostel: number;

    private editButton?: HTMLButtonElement;

    private textArea: HTMLTextAreaElement;

    private selectRating: HTMLSelectElement;

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

    private addCommentClick = (event: Event): void => {
        event.preventDefault();

        this.currentButtonDisabled(true);
        this.addComment(this.idHostel, this.textArea.value, +this.selectRating.value);
        this.editButton.innerText = 'Изменить';
        this.editButton.addEventListener('click', this.editCommentClick);
    };

    private editCommentClick = (event: Event): void => {
        event.preventDefault();

        if (this.textArea.value === this.comment.message && +this.selectRating.value === this.comment.rating) {
            return;
        }

        this.currentButtonDisabled(true);
        this.editComment(this.comment.comm_id, this.textArea.value, +this.selectRating.value);
    };

    private userAppear = (user: UserData): void => {
        if (user) {
            this.render();
        }
    };

    private render(): void {
        if (!this.comment) {
            this.place.classList.add('hostel__user-comment--no-auth-container');
        }
        this.place.innerHTML = templateUser({ isAuth: User.isAuth, comment: this.comment });

        this.editButton = document.getElementById('button-comment') as HTMLButtonElement;
        this.textArea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
        this.selectRating = document.getElementById('select-rating') as HTMLSelectElement;

        this.currentButtonDisabled(false);
    }

    private subscribeEvents(): void {
        Events.subscribe(AUTH_USER, this.userAppear);

        if (this.comment) {
            this.editButton?.addEventListener('click', this.editCommentClick);
        } else {
            this.editButton?.addEventListener('click', this.addCommentClick);
        }
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(AUTH_USER, this.userAppear);

        this.editButton?.removeEventListener('click', this.editCommentClick);
        this.editButton?.removeEventListener('click', this.addCommentClick);
    }

    private currentButtonDisabled(disabled: boolean): void {
        if (this.editButton) {
            this.editButton.disabled = disabled;
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
                    this.editButton.removeEventListener('click', this.addCommentClick);
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
                    Redirector.redirectError(`Ошибка сервера - ${code || value.error}`);
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
                    Redirector.redirectError(`Ошибка сервера - ${code || value.error}`);
                    break;
            }
        });
    }
}
