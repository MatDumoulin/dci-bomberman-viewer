import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "bomberman-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    constructor(
        private _router: Router,
    ) {}

    hasToDisplayToolbar(): boolean {
        return this._router.url !== "/home";
    }
}
