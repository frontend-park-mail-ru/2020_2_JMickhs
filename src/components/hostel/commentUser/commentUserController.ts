import { AbstractController } from "@interfaces/controllers";
import { CommentData } from "@interfaces/structsData/commentData";

import * as templateUser from "@hostel/templates/hostelComment.hbs";
import NetworkHostel from "@/helpers/network/networkHostel";
import User from "@/helpers/user/user";


export default class CommentUserController implements AbstractController {

    private place: HTMLElement;
    private comment?: CommentData;
    private idHostel: number;

    private btn: HTMLElement;

    private handlers: Record<string, (arg: unknown) => void>;

    constructor() {
        this.handlers = {
            addComment: (evt: Event) => {
                evt.preventDefault();

                this.addComment(this.idHostel, 'kek', 4);
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

        this.btn = document.getElementById('btn-add-comment');

        this.subscribeEvents();
    }

    private subscribeEvents(): void {
        if (this.btn) {
            this.btn.addEventListener('click', this.handlers.addComment);
        }
        
    }

    private unsubscribeEvents(): void {
        if (this.btn) {
            this.btn.removeEventListener('click', this.handlers.addComment);
        }
    }

    private addComment(idHostel: number, message: string, rate: number): void {
        const response = NetworkHostel.addComment(idHostel, message, rate);

        response.then((value) => {
            const code = value.code;
        });
    }

}