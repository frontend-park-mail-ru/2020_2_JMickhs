import { PageView } from '@interfaces/views';
import { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';
import * as hostelCardTemplate from '@hostel/templates/hostel-page.hbs';
import { CommentData } from '@/helpers/network/structs-server/comment-data';

import HostelDataComponent from './hostel-data/hostel-data';
import CommentUserComponent from './comment-user/comment-user';
import CommentsComponent from './comments/comments';

import '@hostel/templates/hostel-page.css';

export default class HostelPageView extends PageView {
    private dataComponent: HostelDataComponent;

    private userCommentComponent: CommentUserComponent;

    private commentsComponent: CommentsComponent;

    constructor(parent: HTMLElement) {
        super(parent);

        this.dataComponent = new HostelDataComponent();
        this.userCommentComponent = new CommentUserComponent();
        this.commentsComponent = new CommentsComponent();
    }

    render(data: {hostel: HostelData, comment: CommentData}): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = hostelCardTemplate(data);

        const dataPlace = document.getElementById('hostel-data') as HTMLDivElement;
        const imagesPlace = document.getElementById('hostel-images') as HTMLDivElement;
        this.dataComponent.setPlace(dataPlace, imagesPlace);
        this.dataComponent.activate(data.hostel);

        const placeUserComment = document.getElementById('user-comment') as HTMLDivElement;
        this.userCommentComponent.setPlace(placeUserComment);
        this.userCommentComponent.activate(data.hostel.id, data.comment);

        const placeComments = document.getElementById('hostel-comments') as HTMLDivElement;
        this.commentsComponent.setPlace(placeComments);
        this.commentsComponent.activate(data.hostel.id);
    }

    hide(): void {
        if (this.dataComponent) {
            this.dataComponent.deactivate();
            this.userCommentComponent.deactivate();
            this.commentsComponent.deactivate();
        }
        this.page.innerHTML = '';
    }
}
