import {PageView} from '@interfaces/views';
import {HostelData} from '@interfaces/structsData/hostelData';
import HostelDataController from './hostelData/hostelDataController';


import * as hostelCardTemplate from '@hostel/templates/hostelPage.hbs';
import CommentUserController from './commentUser/commentUserController';
import { CommentData } from '@/helpers/interfaces/structsData/commentData';

export default class HostelPageView extends PageView {

    private dataComponent: HostelDataController;
    private userCommentComponent: CommentUserController;

    constructor(parent: HTMLElement) {
        super(parent);

        
        this.dataComponent = new HostelDataController();
        this.userCommentComponent = new CommentUserController();
    }

    render(data: {hostel: HostelData, comment: CommentData}): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = hostelCardTemplate(data);

        const dataPlace = document.getElementById('hostel-data');
        const imagesPlace = document.getElementById('hostel-images');
        this.dataComponent.activate({placeData: dataPlace, placeImages: imagesPlace, hostel: data.hostel});
        const placeUserComment = document.getElementById('user-comment');
        this.userCommentComponent.activate({place: placeUserComment, idHostel: data.hostel.id, comment: data.comment});
    }

    hide(): void {
        this.dataComponent.deactivate();
        this.userCommentComponent.deactivate();
        this.page.innerHTML = '';
    }
}