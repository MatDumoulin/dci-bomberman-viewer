import { Component, OnInit } from "@angular/core";
import { ServerUrlService } from "../services/server-url/server-url.service";

@Component({
    selector: "bomberman-toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.css"]
})
export class ToolbarComponent implements OnInit {
    gameUrl: string;
    leaderboardUrl: string;

    constructor(private _serverUrlService: ServerUrlService) {}

    ngOnInit() {
        this._serverUrlService.onChange(() => {
            this.gameUrl = this._serverUrlService.getGameUrl();
            this.leaderboardUrl = this._serverUrlService.getLeaderboardUrl();
        });
    }
}
