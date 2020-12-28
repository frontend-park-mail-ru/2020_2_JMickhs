import NetworkHostel from '@/helpers/network/network-hostel';
import type { CommentData } from '@/helpers/network/structs-server/comment-data';
import type PageInfo from '@/helpers/network/structs-server/page-info';
import Redirector from '@router/redirector';
import { ERROR_400, ERROR_403, ERROR_DEFAULT } from '@global-variables/network-error';
import type { AbstractComponent } from '@interfaces/components';
import type { ResponseData } from '@/helpers/network/structs-server/respose-data';

import './comments.css';
import * as template from '@hostel/comments/comments.hbs';
import notificationUser from '@/components/notification-user/notification-user';
import Popup from '@/components/popup/popup';
import HostelImagesComponent from '../hostel-images/hostel-images';

const ERROR_SECOND_COMMENT = 'Второй раз ставите оценку!';
const UNKNOW_IMAGES_ERROR = 'Непредвиденная при открытии изображения!';

export default class CommentsComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private nextButton?: HTMLButtonElement;

    private prevButton?: HTMLButtonElement;

    private idHostel: number;

    private comment: CommentData;

    private countComments: number;

    private nextUrl: string;

    private prevUrl: string;

    private commentImages?: HTMLDivElement;

    private album: string[];

    private notification = notificationUser;

    private imagesComponent = new HostelImagesComponent();

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

    private nextComment = (event: Event): void => {
        event.preventDefault();

        this.buttonsDisabled(true);
        this.getComment(this.nextUrl);
    };

    private prevComment = (event: Event): void => {
        event.preventDefault();

        this.buttonsDisabled(true);
        this.getComment(this.prevUrl);
    };

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
            const comment = data.comments ? data.comments[0] : undefined;
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
                    Redirector.redirectError(ERROR_400);
                    break;
                case 403:
                    Redirector.redirectError(ERROR_403);
                    break;
                case 423:
                    Redirector.redirectError(ERROR_SECOND_COMMENT);
                    break;
                default:
                    Redirector.redirectError(`${ERROR_DEFAULT}${code || value.error}`);
                    break;
            }
        });
    }

    private buttonsDisabled(disabled: boolean): void {
        if (!this.nextButton && !this.prevButton) {
            return;
        }

        this.nextButton.disabled = disabled;
        this.prevButton.disabled = disabled;
    }

    private render(): void {
        if (!this.countComments) {
            this.place.classList.add('hostel__comments--no-auth-container');
        }
        this.place.innerHTML = template({ switch: this.countComments > 1, comment: this.comment });

        this.nextButton = document.getElementById('comment-next') as HTMLButtonElement;
        this.prevButton = document.getElementById('comment-prev') as HTMLButtonElement;
        this.commentImages = document.getElementById('container-comments-images') as HTMLDivElement;

        this.buttonsDisabled(false);
    }

    private imageClick = (evt: Event): void => {
        const image = evt.target as HTMLImageElement;
        if (image === undefined) {
            return;
        }

        const response = NetworkHostel.getAlbum(this.idHostel);
        response.then((value) => {
            const { code } = value;
            const data = value.data as {
                photos: string[],
            };
            if (code === 200) {
                this.album = data.photos;
                this.openAlbum(this.album.indexOf(image.src));
            } else {
                this.renderMessage(UNKNOW_IMAGES_ERROR, true);
            }
        });
    };

    private openAlbum(start: number): void {
        if (start < 0 || start >= this.album.length) {
            return;
        }
        Popup.activate(this.imagesComponent, this.album, start, 2);
    }

    private renderMessage(text: string, isError: boolean): void {
        this.notification.showMessage(text, isError);
    }

    private subscribeEvents(): void {
        this.nextButton?.addEventListener('click', this.nextComment);
        this.prevButton?.addEventListener('click', this.prevComment);
        this.commentImages?.addEventListener('click', this.imageClick);
    }

    private unsubscribeEvents(): void {
        this.nextButton?.removeEventListener('click', this.nextComment);
        this.prevButton?.removeEventListener('click', this.prevComment);
        this.commentImages?.removeEventListener('click', this.imageClick);
    }
}
