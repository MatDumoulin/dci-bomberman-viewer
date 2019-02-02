import { Component, OnInit, OnDestroy } from "@angular/core";
import { environment } from '../../environments/environment';

@Component({
    selector: "bomberman-toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.css"]
})
export class ToolbarComponent implements OnInit, OnDestroy {
    gameUrl: string;
    leaderboardUrl: string;

    constructor() {}

    ngOnInit() {
        this.gameUrl = environment.loadBalancerUrl + "/game";
        this.leaderboardUrl = environment.leaderboardServerUrl + "/leaderboard";
    }

    ngOnDestroy() {
    }
}
