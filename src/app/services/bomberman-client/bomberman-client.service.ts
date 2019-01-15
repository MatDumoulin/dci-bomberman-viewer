import { Injectable, OnDestroy } from "@angular/core";
import { Client } from "colyseus.js";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class BombermanClientService implements OnDestroy {
    client: Client;
    errors: Subject<string>;
    serverUrl: string;

    constructor() {
        this.errors = new Subject<string>();
    }

    ngOnDestroy() {
        this.close();
        this.errors.complete();
    }

    connect(serverUrl: string): Client {
        this.serverUrl = serverUrl;
        this.client = new Client('ws:' + serverUrl);
        this.setUpErrorListener();

        return this.client;
    }

    isConnected(client: Client): boolean {
        return this.client && this.client.id !== null && this.client.id !== undefined;
    }

    close(): void {
        this.client.onError.removeAll();
        this.client.close();
        this.serverUrl = null;
    }

    private setUpErrorListener(): void {
        if (this.client) {
            this.client.onError.add((error) => {
                this.errors.next(error);
            });
        }
    }
}
