import {PageView} from '@interfaces/views';
import {HostelData} from '@interfaces/structsData/hostelData';
import HostelDataController from './hostelData/hostelDataController';


import * as hostelCardTemplate from '@hostel/templates/hostelPage.hbs';
import CommentUserController from './commentUser/commentUserController';
import { CommentData } from '@/helpers/network/structsServer/commentData';
import CommentsController from './comments/commentsController';

export default class HostelPageView extends PageView {

    private dataComponent: HostelDataController;
    private userCommentComponent: CommentUserController;
    private commentsComponent: CommentsController;

    constructor(parent: HTMLElement) {
        super(parent);

        
        this.dataComponent = new HostelDataController();
        this.userCommentComponent = new CommentUserController();
        this.commentsComponent = new CommentsController();
    }

    render(data: {hostel: HostelData, comment: CommentData}): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = hostelCardTemplate(data);

        const dataPlace = document.getElementById('hostel-data');
        const imagesPlace = document.getElementById('hostel-images');
        this.dataComponent.activate({placeData: dataPlace, placeImages: imagesPlace, hostel: data.hostel});
        const placeUserComment = document.getElementById('user-comment');
        this.userCommentComponent.activate({place: placeUserComment, idHostel: data.hostel.id, comment: data.comment});
        const placeComments = document.getElementById('hostel-comments');
        this.commentsComponent.activate({place: placeComments, idHostel: data.hostel.id});
    }

    hide(): void {
        this.dataComponent.deactivate();
        this.userCommentComponent.deactivate();
        this.commentsComponent.deactivate();
        this.page.innerHTML = '';
    }
}