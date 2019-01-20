import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from "@angular/core";
import { ServerUrlService } from "../services/server-url/server-url.service";
import { Subscription } from "rxjs";

@Component({
    selector: "bomberman-toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.css"]
})
export class ToolbarComponent implements AfterViewInit, OnDestroy {
    private _sub: Subscription;
    gameUrl: string;
    leaderboardUrl: string;

    constructor(private _serverUrlService: ServerUrlService, private _changeDetector: ChangeDetectorRef) {}

    ngAfterViewInit() {
        this._sub = this._serverUrlService.onChange(() => {
            console.log("Toolbar onChange!");
            this.gameUrl = this._serverUrlService.getGameUrl();
            this.leaderboardUrl = this._serverUrlService.getLeaderboardUrl();
            console.log(this.gameUrl);
            console.log(this.leaderboardUrl);
        });
    }

    ngOnDestroy() {
        this._sub.unsubscribe();
    }
}
