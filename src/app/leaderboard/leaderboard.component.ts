import { Component, OnInit, OnDestroy } from "@angular/core";
import { Room, Client } from "colyseus.js";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { BombermanStats } from "../models";

@Component({
    selector: "bomberman-leaderboard",
    templateUrl: "./leaderboard.component.html",
    styleUrls: ["./leaderboard.component.css"]
})
export class LeaderboardComponent implements OnInit, OnDestroy {
    private _room: Room;
    private _serverUrl: string;
    private _client: Client;
    errors: string[] = [];
    stats: BombermanStats;

    constructor(
        private _route: ActivatedRoute
    ) {}

    ngOnInit() {
        const fullUrl = this._route.snapshot.paramMap.get("serverUrl").split(":");
        this._serverUrl = fullUrl[0] + ":3500";
        this.connectClient();
        this._room = this._client.join("leaderboard");
        this.onSocketConnectionSetUp();
    }

    ngOnDestroy(): void {
        if (this._room) {
            this._room.leave();
        }

        if (this._client) {
            this._client.close();
        }
    }

    private connectClient(): void {
        this._client = new Client('ws:' + this._serverUrl);
    }

    onSocketConnectionSetUp(): void {

        // We begin by removing all listeners to prevent listener stacking.
        this._client.onError.removeAll();
        this._room.onJoin.removeAll();

        // Then, we subscribe to the events that we want.
        this._room.onJoin.add(() => {
            console.log(this._client.id, "joined", this._room.name);
            this.errors = [];
        });

        this._room.onStateChange.add(() => {
            this.stats = this._room.state;
        });


        this._client.onError.add((clientError) => {
            console.log("An error occurred with the client:", clientError);
            const errorMessage = "Unable to connect to server with url " + this._serverUrl;

            if (this.errors.findIndex(error => error === errorMessage) === -1) {
                this.errors.push(errorMessage);
            }
        });
    }
}
