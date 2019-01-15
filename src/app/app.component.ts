import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter, tap } from 'rxjs/operators';
import { ServerUrlService } from "./services/server-url/server-url.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _serverUrlService: ServerUrlService
    ) {}

    ngOnInit() {
        this._router.events.pipe(
            filter(e => e instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            console.log("URL:", event.urlAfterRedirects);
            const decomposedUrl = event.urlAfterRedirects.split("/");
            this._serverUrlService.url = decomposedUrl[1];
        });
    }

    hasToDisplayToolbar(): boolean {
        return this._router.url !== "/home";
    }
}
