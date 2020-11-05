import { PageView } from '@interfaces/views';
import { HostelData } from '@interfaces/structsData/hostelData';
import * as hostelCardTemplate from '@hostel/templates/hostelPage.hbs';
import { CommentData } from '@network/structsServer/commentData';

import HostelDataComponent from './components/hostelData';
import CommentUserComponent from './components/commentUser';
import CommentsComponent from './components/comments';

export default class HostelPageView extends PageView {
    private dataComponent: HostelDataComponent;

    private userCommentComponent: CommentUserComponent;

    private commentsComponent: CommentsComponent;

    render(data: {hostel: HostelData, comment: CommentData}): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = hostelCardTemplate(data);

        const dataPlace = document.getElementById('hostel-data') as HTMLDivElement;
        const imagesPlace = document.getElementById('hostel-images') as HTMLDivElement;
        this.dataComponent = new HostelDataComponent(dataPlace, imagesPlace);
        this.dataComponent.activate(data.hostel);
        const placeUserComment = document.getElementById('user-comment') as HTMLDivElement;
        this.userCommentComponent = new CommentUserComponent(placeUserComment);
        this.userCommentComponent.activate(data.hostel.id, data.comment);
        const placeComments = document.getElementById('hostel-comments') as HTMLDivElement;
        this.commentsComponent = new CommentsComponent(placeComments);
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
