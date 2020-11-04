import { PageView } from '@interfaces/views';
import { HostelData } from '@interfaces/structsData/hostelData';
import * as hostelCardTemplate from '@hostel/templates/hostelPage.hbs';
import { CommentData } from '@/helpers/network/structsServer/commentData';
import HostelDataController from './hostelData/hostelDataController';

import CommentUserController from './commentUser/commentUserController';
import CommentsController from './comments/commentsController';

export default class HostelPageView extends PageView {
    private dataComponent: HostelDataController;

    private userCommentComponent: CommentUserController;

    private commentsComponent: CommentsController;

    render(data: {hostel: HostelData, comment: CommentData}): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = hostelCardTemplate(data);

        const dataPlace = document.getElementById('hostel-data') as HTMLDivElement;
        const imagesPlace = document.getElementById('hostel-images') as HTMLDivElement;
        this.dataComponent = new HostelDataController(dataPlace, imagesPlace);
        this.dataComponent.activate(data.hostel);
        const placeUserComment = document.getElementById('user-comment') as HTMLDivElement;
        this.userCommentComponent = new CommentUserController(placeUserComment);
        this.userCommentComponent.activate(data.hostel.id, data.comment);
        const placeComments = document.getElementById('hostel-comments') as HTMLDivElement;
        this.commentsComponent = new CommentsController(placeComments);
        this.commentsComponent.activate(data.hostel.id);
    }

    hide(): void {
        this.dataComponent.deactivate();
        this.userCommentComponent.deactivate();
        this.commentsComponent.deactivate();
        this.page.innerHTML = '';
    }
}
