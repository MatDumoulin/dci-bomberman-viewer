import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Room, Client } from "colyseus.js";
import { BombermanStats, BombermanRoomStats, Stat } from "../models";
import { BarHorizontalComponent } from "@swimlane/ngx-charts";
import { environment } from '../../environments/environment';

@Component({
    selector: "bomberman-leaderboard",
    templateUrl: "./leaderboard.component.html",
    styleUrls: ["./leaderboard.component.css"]
})
export class LeaderboardComponent implements OnInit, OnDestroy {
    private _room: Room<BombermanRoomStats>;
    private _serverUrl: string;
    private _client: Client;
    errors: string[] = [];
    stats = new BombermanStats();

    @ViewChild('chart')
    chartComponent: BarHorizontalComponent;

    constructor() {}

    ngOnInit() {
        this._serverUrl = environment.leaderboardServerUrl;
        this.connectClient();
        this._room = this._client.join("leaderboard");
        this.onSocketConnectionSetUp();
    }

    ngOnDestroy(): void {
        if (this._room && this._room.hasJoined) {
            this._room.leave();
        }

        if (this._client && this._client.id !== null) {
            this._client.close();
        }
    }

    private connectClient(): void {
        this._client = new Client("ws:" + this._serverUrl);
    }

    onSocketConnectionSetUp(): void {
        // We begin by removing all listeners to prevent listener stacking.
        this._client.onError.removeAll();
        this._room.onJoin.removeAll();

        // Then, we subscribe to the events that we want.
        this._room.onJoin.add(() => {
            this.errors = [];
        });

        this._room.onStateChange.add(() => {
            // Mapping room state to stats
            this.mapRoomStateToStats(this._room.state);
        });

        this._client.onError.add(clientError => {
            console.log("An error occurred with the client:", clientError);
            const errorMessage =
                "Unable to connect to server with url " + this._serverUrl;

            if (this.errors.findIndex(error => error === errorMessage) === -1) {
                this.errors.push(errorMessage);
            }
        });
    }

    private mapRoomStateToStats(roomStats: BombermanRoomStats): void {
        this.stats.winner = this.mapRoomStatePropToStats(roomStats.winner);
        this.stats.kills = this.mapRoomStatePropToStats(roomStats.kills);
    }

    private mapRoomStatePropToStats(
        roomStateProp: { [playerId: string]: number }
    ): Stat[] {
        const ids = Object.keys(roomStateProp);
        return ids.map(id => new Stat(id, roomStateProp[id]));
    }
}
