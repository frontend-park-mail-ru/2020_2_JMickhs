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

import * as template from '@hostel/comment-user/comment-user.hbs';
import './comment-user.css';
import type { UserData } from '@interfaces/structs-data/user-data';
import { ERROR_400, ERROR_403, ERROR_DEFAULT } from '@/helpers/global-variables/network-error';
import CommentImagesComponent from '../comment-images/comment-images';

const MAX_IMAGES_COUNT = 5;

const ERROR_COUNT_MESSAGES = 'Нельзя добавить больше 5 фотографий!';
const ERROR_SECOND_COMMENT = 'Второй раз ставите оценку!';

export default class CommentUserComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private idHostel: number;

    private comment?: CommentData;

    private saveCommentButton: HTMLButtonElement;

    private buttonIsEdit: boolean;

    private readonly buttonTextAdd = 'Отправить';

    private readonly buttonTextEdit = 'Редактировать';

    private showTextArea: boolean;

    private textArea: HTMLTextAreaElement;

    private selectRating: HTMLSelectElement;

    private fileInput?: HTMLInputElement;

    private notification = NotificationUser;

    private user = User;

    private commentImages = new CommentImagesComponent();

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    setImagesPlace(place: HTMLDivElement): void {
        this.commentImages.setPlace(place);
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

        this.commentImages.activate();
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
        this.saveCommentButton = document.getElementById('button-comment') as HTMLButtonElement;
        this.textArea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
        this.selectRating = document.getElementById('select-rating') as HTMLSelectElement;
        this.fileInput = document.getElementById('upload-comment') as HTMLInputElement;
        if (this.saveCommentButton) {
            this.saveCommentButton.disabled = false;
        }
    }

    private subscribeEvents(): void {
        Events.subscribe(AUTH_USER, this.userAppear);

        this.fileInput?.addEventListener('change', this.addFiles);
        if (this.buttonIsEdit) {
            this.saveCommentButton?.addEventListener('click', this.clickEditComment);
        } else {
            this.saveCommentButton?.addEventListener('click', this.clickSaveComment);
        }
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(AUTH_USER, this.userAppear);
        this.saveCommentButton?.removeEventListener('click', this.clickEditComment);
        this.saveCommentButton?.removeEventListener('click', this.clickSaveComment);
        this.fileInput?.removeEventListener('change', this.addFiles);
    }

    private addFiles = (event: Event): void => {
        event.preventDefault();

        const array = this.fileInput.files;
        if (!array) {
            return;
        }

        if (array.length + this.commentImages.count > MAX_IMAGES_COUNT) {
            this.fileInput.value = '';
            this.notification.showMessage(ERROR_COUNT_MESSAGES, true);
            return;
        }

        this.commentImages.clear();
        for (let i = 0; i < array.length; i += 1) {
            const file = array[i];
            this.commentImages.addImage(file.name);
        }
    };

    private userAppear = (user: UserData): void => {
        if (user) {
            this.render();
        }
    };

    private clickSaveComment = (event: Event): void => {
        event.preventDefault();
        this.saveCommentButton.disabled = true;

        if (this.comment) {
            const newMessage = this.textArea.value;
            const newRating = +this.selectRating.value;
            if (this.comment.message === newMessage && this.comment.rating === newRating) {
                this.renderMessage('Вы ничего не поменяли', true);
                this.saveCommentButton.disabled = false;
                return;
            }
            this.editComment(this.comment.comm_id, newMessage, newRating);
        } else {
            this.addComment(this.idHostel, this.textArea.value, +this.selectRating.value);
        }
    };

    private clickEditComment = (event: Event): void => {
        event.preventDefault();

        this.showTextArea = true;
        this.saveCommentButton.removeEventListener('click', this.clickEditComment);
        this.render();
        this.saveCommentButton.addEventListener('click', this.clickSaveComment);
    };

    deactivate(): void {
        if (!this.place || this.place.innerHTML === '') {
            return;
        }

        this.commentImages.deactivate();
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
            this.saveCommentButton.disabled = false;
            switch (code) {
                case 200:
                    const data = value.data as {
                        new_rate: number,
                        comment: CommentData;
                    };
                    this.comment = data.comment;
                    Events.trigger(UPDATE_RATING_HOSTEL, { rating: data.new_rate, delta: 1 });
                    this.showTextArea = false;
                    this.saveCommentButton.removeEventListener('click', this.clickSaveComment);
                    this.render();
                    this.saveCommentButton.addEventListener('click', this.clickEditComment);
                    this.renderMessage('Вы успешно оставили отзыв!', false);
                    break;
                case 400:
                    this.renderMessage(ERROR_400, true);
                    break;
                case 403:
                    this.renderMessage(ERROR_403, true);
                    break;
                case 423:
                    this.renderMessage(ERROR_SECOND_COMMENT, true);
                    break;
                default:
                    this.renderMessage(`${ERROR_DEFAULT}${code || value.error}`, true);
                    break;
            }
        });
    }

    private editComment(idComment: number, message: string, rating: number): void {
        const response = NetworkHostel.editComment(idComment, message, rating);

        response.then((value) => {
            const { code } = value;
            this.saveCommentButton.disabled = false;
            switch (code) {
                case 200:
                    const data = value.data as {
                        new_rate: number,
                        comment: CommentData;
                    };
                    this.comment = data.comment;
                    Events.trigger(UPDATE_RATING_HOSTEL, { rating: data.new_rate, delta: 0 });

                    this.showTextArea = false;
                    this.saveCommentButton.removeEventListener('click', this.clickSaveComment);
                    this.render();
                    this.saveCommentButton.addEventListener('click', this.clickEditComment);
                    this.renderMessage('Вы успешно изменили отзыв!', false);
                    break;
                case 400:
                    this.renderMessage(ERROR_400, true);
                    break;
                case 403:
                    this.renderMessage(ERROR_403, true);
                    break;
                case 423:
                    this.renderMessage(ERROR_SECOND_COMMENT, true);
                    break;
                default:
                    this.renderMessage(`${ERROR_DEFAULT}${code || value.error}`, true);
                    break;
            }
        });
    }
}
