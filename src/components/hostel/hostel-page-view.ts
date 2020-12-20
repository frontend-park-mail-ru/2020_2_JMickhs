import { PageView } from '@interfaces/views';
import type { HostelData } from '@interfaces/structs-data/hostel-data';
import * as hostelCardTemplate from '@hostel/templates/hostel-page.hbs';
import type { CommentData } from '@network/structs-server/comment-data';

import HostelDataComponent from './hostel-data/hostel-data';
import HostelImagesComponent from './hostel-images/hostel-images';
import CommentUserComponent from './comment-user/comment-user';
import CommentsComponent from './comments/comments';

import '@hostel/templates/hostel-page.css';

export default class HostelPageView extends PageView {
    private dataComponent: HostelDataComponent;

    private imagesComponent: HostelImagesComponent;

    private userCommentComponent: CommentUserComponent;

    private commentsComponent: CommentsComponent;

    constructor(place: HTMLElement) {
        super(place);

        this.dataComponent = new HostelDataComponent();
        this.imagesComponent = new HostelImagesComponent();
        this.userCommentComponent = new CommentUserComponent();
        this.commentsComponent = new CommentsComponent();
    }

    render(data: { isAuth: boolean, hostel: HostelData, comment: CommentData}): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = hostelCardTemplate(data);

        const dataPlace = document.getElementById('hostel-data') as HTMLDivElement;
        this.dataComponent.setPlace(dataPlace);
        this.dataComponent.activate(data.hostel);

        const imagesPlace = document.getElementById('hostel-images') as HTMLDivElement;
        this.imagesComponent.setPlace(imagesPlace);
        const photos = data.hostel.photos || [];
        photos.unshift(data.hostel.image);
        const idImages = 228; // уникальная цифра с потолка
        this.imagesComponent.activate(photos, 0, idImages);

        const placeUserComment = document.getElementById('user-comment') as HTMLDivElement;
        this.userCommentComponent.setPlace(placeUserComment);
        this.userCommentComponent.activate(data.hostel.id, data.comment);

        const placeComments = document.getElementById('hostel-comments') as HTMLDivElement;
        this.commentsComponent.setPlace(placeComments);
        this.commentsComponent.activate(data.hostel.id);
    }

    hide(): void {
        if (this.page.innerHTML === '') {
            return;
        }

        this.dataComponent.deactivate();
        this.imagesComponent.deactivate();
        this.userCommentComponent.deactivate();
        this.commentsComponent.deactivate();

        this.page.innerHTML = '';
    }
}
