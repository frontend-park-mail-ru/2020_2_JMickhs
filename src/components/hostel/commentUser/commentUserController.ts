import { AbstractController } from "@interfaces/controllers";
import { CommentData } from "@interfaces/structsData/commentData";


import Events from '@eventBus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
} from '@eventBus/constants';

import * as templateUser from "@hostel/templates/hostelComment.hbs";
import NetworkHostel from "@/helpers/network/networkHostel";
import User from "@/helpers/user/user";


export default class CommentUserController implements AbstractController {

    private place: HTMLElement;
    private comment?: CommentData;
    private idHostel: number;

    private btnAdd: HTMLElement;
    private textArea: HTMLTextAreaElement;
    private selectRating: HTMLSelectElement;

    private handlers: Record<string, (arg: unknown) => void>;

    constructor() {
        this.handlers = {
            addComment: (evt: Event) => {
                evt.preventDefault();

                this.addComment(this.idHostel, this.textArea.value, +this.selectRating.value);
            },
        };
    }

    activate(arg: {place: HTMLElement, idHostel: number, comment?: CommentData}): void {
        this.place = arg.place;
        this.idHostel = arg.idHostel;
        this.comment = arg.comment;

        this.render();
    }

    deactivate(): void {
        this.place.innerHTML = '';

        this.unsubscribeEvents();
    }

    private render(): void {
        this.place.innerHTML = templateUser({isAuth: User.getInstance().isAuth, comment: this.comment});

        this.btnAdd = document.getElementById('btn-add-comment');
        this.textArea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
        this.selectRating = document.getElementById('select-rating') as HTMLSelectElement;

        this.subscribeEvents();
    }

    private subscribeEvents(): void {
        if (this.btnAdd) {
            this.btnAdd.addEventListener('click', this.handlers.addComment);
        }
        
    }

    private unsubscribeEvents(): void {
        if (this.btnAdd) {
            this.btnAdd.removeEventListener('click', this.handlers.addComment);
        }
    }

    private addComment(idHostel: number, message: string, rate: number): void {
        const response = NetworkHostel.addComment(idHostel, message, rate);

        response.then((value) => {
            const code = value.code;
            switch (code) {
            case 200: 
                const data = value.data as {
                    new_rate: number,
                    comment: CommentData;
                };
                this.comment = data.comment;
                Events.trigger(UPDATE_RATING_HOSTEL, this.comment.rating);
                this.render();
            }
        });

        
    }

}