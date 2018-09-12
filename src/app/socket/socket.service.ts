import { Injectable, OnDestroy } from "@angular/core";
import { connect } from "socket.io-client";
import { BehaviorSubject } from "rxjs";
import { GameState, GameStateFromServer } from "../models/game-state";

@Injectable({
    providedIn: "root"
})
export class SocketService implements OnDestroy {
    private _socket: any;
    private _isConnected = false;
    errors: BehaviorSubject<string> = new BehaviorSubject(null);

    constructor() {}

    ngOnDestroy(): void {
        if (this._socket && this._socket.connected) {
            this._socket.disconnect();
        }
    }

    connect(serverUrl: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.errors.next(null); // resetting errors since we try to connect to another server.
            this._socket = connect(serverUrl);

            this._socket.on("connect", () => {
                console.log("Connected.");
                this.errors.next(null);
                this._isConnected = true;
                resolve();
                // Sending a request to the server in order to view the game.
                this._socket.emit("viewGame");
            });

            this._socket.on("connect_error", () => {
                const errorMessage =
                    "Unable to connect to server with url " + serverUrl;
                console.log(errorMessage);
                this.errors.next(errorMessage); // Adding the error to the end of the errors.
            });

            this._socket.on("disconnect", () => {
                console.log("Disconnected.");
                this._isConnected = false;
            });
        });
    }

    disconnect(): void {
        if (this._socket && this._socket.connected) {
            this._socket.disconnect();
        }
    }

    // Subscribes to the given socket event and calls the callback
    // when the event occurs.
    on(event: string, callback: Function): void {
        this._socket.on(event, callback);
    }

    get isConnected(): boolean {
        return this._isConnected;
    }
}
