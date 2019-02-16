import { Injectable, OnDestroy } from "@angular/core";
import { Client } from "colyseus.js";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class RootServerService implements OnDestroy {
    client: Client;

    errors = new BehaviorSubject<string[]>([]);

    constructor() {
        // Setting up a connection with the root server
        this.client = new Client("ws:" + environment.rootServerUrl);
        this.listenForErrors();
    }

    ngOnDestroy() {
        this.errors.complete();
    }

    isConnected(): boolean {
        return this.client && !!this.client.id;
    }

    close() {
        this.client.close();
    }

    private listenForErrors() {
        if (this.client) {
            this.client.onError.add(error => {
                const errorMessage = `Unable to communicate with server located at ${environment.rootServerUrl}`;
                if (this.errors.value.find(e => e === errorMessage) === undefined) {
                    this.errors.next([...this.errors.value, errorMessage]);
                }
            });
        }
    }
}
