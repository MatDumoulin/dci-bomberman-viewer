import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private _userId: string;

    constructor() {}

    get userId(): string {
        return this._userId;
    }

    set userId(id: string) {
        this._userId = id;
    }
}
