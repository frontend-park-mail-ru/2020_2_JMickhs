import { PageView } from '@interfaces/views';
import type { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';
import * as hostelCardTemplate from '@hostel/templates/hostel-page.hbs';
import type { CommentData } from '@/helpers/network/structs-server/comment-data';

import HostelDataComponent from './hostel-data/hostel-data';
import HostelImagesComponent from './hostel-images/hostel-images';
import CommentUserComponent from './comment-user/comment-user';
import CommentsComponent from './comments/comments';
import MapComponent from './map/map';

import '@hostel/templates/hostel-page.css';

export default class HostelPageView extends PageView {
    private dataComponent: HostelDataComponent;

    private imagesComponent: HostelImagesComponent;

    private userCommentComponent: CommentUserComponent;

    private commentsComponent: CommentsComponent;

    private mapComponent: MapComponent;

    constructor(parent: HTMLElement) {
        super(parent);

        this.dataComponent = new HostelDataComponent();
        this.imagesComponent = new HostelImagesComponent();
        this.userCommentComponent = new CommentUserComponent();
        this.commentsComponent = new CommentsComponent();
        this.mapComponent = new MapComponent();
    }

    render(data: {hostel: HostelData, comment: CommentData}): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = hostelCardTemplate(data);

        const dataPlace = document.getElementById('hostel-data') as HTMLDivElement;
        this.dataComponent.setPlace(dataPlace);
        this.dataComponent.activate(data.hostel);

        const imagesPlace = document.getElementById('hostel-images') as HTMLDivElement;
        this.imagesComponent.setPlace(imagesPlace);
        this.imagesComponent.activate(data.hostel);

        const placeUserComment = document.getElementById('user-comment') as HTMLDivElement;
        this.userCommentComponent.setPlace(placeUserComment);
        this.userCommentComponent.activate(data.hostel.id, data.comment);

        const placeComments = document.getElementById('hostel-comments') as HTMLDivElement;
        this.commentsComponent.setPlace(placeComments);
        this.commentsComponent.activate(data.hostel.id);

        const mapPlace = document.getElementById('map-google') as HTMLDivElement;
        this.mapComponent.setPlace(mapPlace);
        // временно хардкодим местоположение, так как на бэке еще не сделана работа с геоданными
        this.mapComponent.activate(55.922212, 37.854629);
    }

    hide(): void {
        if (this.page.innerHTML === '') {
            return;
        }

        this.dataComponent.deactivate();
        this.imagesComponent.deactivate();
        this.userCommentComponent.deactivate();
        this.commentsComponent.deactivate();
        this.mapComponent.deactivate(); // еще не сделано

        this.page.innerHTML = '';
    }
}
