import User from '@user/user';
import type { CommentData } from '@network/structs-server/comment-data';
import type { AbstractComponent } from '@interfaces/components';
import NotificationUser from '@/components/notification-user/notification-user';
import Events from '@eventbus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
    AUTH_USER,
} from '@eventbus/constants';
import NetworkHostel from '@/helpers/network/network-hostel';

import * as template from '@hostel/comment-user/comment-userr.hbs';
import './comment-user.css';
import type { UserData } from '@interfaces/structs-data/user-data';

export default class CommentUserComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private idHostel: number;

    private comment?: CommentData;

    private button: HTMLButtonElement;

    private buttonIsEdit: boolean;

    private readonly buttonTextAdd = 'Отправить';

    private readonly buttonTextEdit = 'Редактировать';

    private showTextArea: boolean;

    private textArea: HTMLTextAreaElement;

    private selectRating: HTMLSelectElement;

    private notification = NotificationUser;

    private user = User;

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(idHostel: number, comment?: CommentData): void {
        if (!this.place) {
            return;
        }

        this.idHostel = idHostel;
        this.comment = comment;

        this.showTextArea = (this.comment === undefined);
        this.buttonIsEdit = !this.showTextArea;

        this.render();
        this.subscribeEvents();
    }

    private render(): void {
        if (!this.comment) {
            this.place.classList.add('hostel__user-comment--no-auth-container');
        }

        const viewModel = {
            isAuth: this.user.isAuth,
            comment: this.comment,
            buttonName: this.showTextArea ? this.buttonTextAdd : this.buttonTextEdit,
            showTextArea: this.showTextArea,
        };

        this.place.innerHTML = template(viewModel);
        this.button = document.getElementById('button-comment') as HTMLButtonElement;
        this.textArea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
        this.selectRating = document.getElementById('select-rating') as HTMLSelectElement;

        if (this.button) {
            this.button.disabled = false;
        }
    }

    private subscribeEvents(): void {
        Events.subscribe(AUTH_USER, this.userAppear);

        if (this.buttonIsEdit) {
            this.button?.addEventListener('click', this.clickEditComment);
        } else {
            this.button?.addEventListener('click', this.clickSaveComment);
        }
    }

    private unsubscribeEvents(): void {

    }

    private userAppear = (user: UserData): void => {
        if (user) {
            this.render();
        }
    };

    private clickSaveComment = (event: Event): void => {
        event.preventDefault();
        this.button.disabled = true;

        if (this.comment) {
            this.editComment(this.comment.comm_id, this.textArea.value, +this.selectRating.value);
        } else {
            this.addComment(this.idHostel, this.textArea.value, +this.selectRating.value);
        }
    };

    private clickEditComment = (event: Event): void => {
        event.preventDefault();

        this.showTextArea = true;
        this.button.removeEventListener('click', this.clickEditComment);
        this.render();
        this.button.addEventListener('click', this.clickSaveComment);
    };

    deactivate(): void {
        if (!this.place || this.place.innerHTML === '') {
            return;
        }

        this.place.innerHTML = '';
        this.unsubscribeEvents();
    }

    private renderMessage(text: string, isError: boolean): void {
        this.notification.showMessage(text, isError);
    }

    private addComment(idHostel: number, message: string, rate: number): void {
        const response = NetworkHostel.addComment(idHostel, message, rate);

        response.then((value) => {
            const { code } = value;
            this.button.disabled = false;
            switch (code) {
                case 200:
                    const data = value.data as {
                        new_rate: number,
                        comment: CommentData;
                    };
                    this.comment = data.comment;
                    Events.trigger(UPDATE_RATING_HOSTEL, { rating: data.new_rate, delta: 1 });
                    this.showTextArea = false;
                    this.render();
                    this.renderMessage('Вы успешно оставили отзыв!', false);
                    break;
                case 400:
                    this.renderMessage('Сервер не смог обработать запрос!', true);
                    break;
                case 403:
                    this.renderMessage('Нет прав доступа!', true);
                    break;
                case 423:
                    this.renderMessage('Второй раз ставите оценку!', true);
                    break;
                default:
                    this.renderMessage(`Ошибка - ${code || value.error}`, true);
                    break;
            }
        });
    }

    private editComment(idComment: number, message: string, rating: number): void {
        const response = NetworkHostel.editComment(idComment, message, rating);

        response.then((value) => {
            const { code } = value;
            this.button.disabled = false;
            switch (code) {
                case 200:
                    const data = value.data as {
                        new_rate: number,
                        comment: CommentData;
                    };
                    this.comment = data.comment;
                    Events.trigger(UPDATE_RATING_HOSTEL, { rating: data.new_rate, delta: 0 });

                    this.showTextArea = false;
                    this.render();

                    this.renderMessage('Вы успешно изменили отзыв!', false);
                    break;
                case 400:
                    this.renderMessage('Сервер не смог обработать запрос!', true);
                    break;
                case 403:
                    this.renderMessage('Нет прав доступа!', true);
                    break;
                case 423:
                    this.renderMessage('Второй раз ставите оценку!', true);
                    break;
                default:
                    this.renderMessage(`Ошибка - ${code || value.error}`, true);
                    break;
            }
        });
    }
}
