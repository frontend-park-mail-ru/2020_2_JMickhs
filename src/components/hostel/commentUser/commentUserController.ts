import { AbstractController } from "@interfaces/controllers";
import { CommentData } from "@/helpers/network/structsServer/commentData";


import Events from '@eventBus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
    HAVE_USER,
} from '@eventBus/constants';

import * as templateUser from "@hostel/templates/hostelComment.hbs";
import NetworkHostel from "@/helpers/network/networkHostel";
import User from "@/helpers/user/user";
import { UserData } from "@/helpers/interfaces/structsData/userData";


export default class CommentUserController implements AbstractController {

    private place: HTMLElement;
    private comment?: CommentData;
    private idHostel: number;

    private btnAdd: HTMLElement;
    private btnEdit: HTMLElement;
    private textArea: HTMLTextAreaElement;
    private selectRating: HTMLSelectElement;

    private handlers: Record<string, (arg: unknown) => void>;

    constructor() {
        this.handlers = {
            addComment: (evt: Event) => {
                evt.preventDefault();

                this.addComment(this.idHostel, this.textArea.value, +this.selectRating.value);
            },
            editComment: (evt: Event) => {
                evt.preventDefault();
                this.editComment(this.comment.comm_id, this.textArea.value, +this.selectRating.value);
            },
            haveUser: (user: UserData) => {
                if (user) {
                    this.render();
                }
            }
        };
    }

    activate(arg: {place: HTMLElement, idHostel: number, comment?: CommentData}): void {
        this.place = arg.place;
        this.idHostel = arg.idHostel;
        this.comment = arg.comment;

        this.render();

        this.btnAdd = document.getElementById('btn-add-comment');
        this.btnEdit = document.getElementById('btn-edit-comment');
        this.textArea = document.getElementById('comment-textarea') as HTMLTextAreaElement;
        this.selectRating = document.getElementById('select-rating') as HTMLSelectElement;

        this.subscribeEvents();
    }

    deactivate(): void {
        this.place.innerHTML = '';

        this.unsubscribeEvents();
    }

    private render(): void {
        this.place.innerHTML = templateUser({isAuth: User.getInstance().isAuth, comment: this.comment});
    }

    private subscribeEvents(): void {
        Events.subscribe(HAVE_USER, this.handlers.haveUser);
        
        if (this.btnAdd) {
            this.btnAdd.addEventListener('click', this.handlers.addComment);
        }

        if (this.btnEdit) {
            this.btnEdit.addEventListener('click', this.handlers.editComment);
        }
        
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(HAVE_USER, this.handlers.haveUser);

        if (this.btnAdd) {
            this.btnAdd.removeEventListener('click', this.handlers.addComment);
        }
        if (this.btnEdit) {
            this.btnEdit.removeEventListener('click', this.handlers.editComment);
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
                Events.trigger(UPDATE_RATING_HOSTEL, {rating: data.new_rate, delta: 1});

                this.btnAdd.removeEventListener('click', this.handlers.addComment);
                this.render();
                break;
            }
        });
    }

    private editComment(idComment: number, message: string, rating: number): void {
        const response = NetworkHostel.editComment(idComment, message, rating);

        response.then((value) => {
            const code = value.code;
            switch(code) {
            case 200: 
                const data = value.data as {
                    new_rate: number,
                    comment: CommentData;
                };
                this.comment = data.comment;
                Events.trigger(UPDATE_RATING_HOSTEL, {rating: data.new_rate, delta: 0});
                this.render();
                break;
            }
        });
    }
}