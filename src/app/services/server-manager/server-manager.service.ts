import { Injectable, OnDestroy } from "@angular/core";
import { Room, Client } from "colyseus.js";
import { ServerInfo } from "src/app/models";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: "root"
})
export class ServerManagerService implements OnDestroy {
    private _client: Client;
    private _loadBalancerRoom: Room;

    servers = new BehaviorSubject<{ [url: string]: ServerInfo }>({});
    errors = new BehaviorSubject<string[]>([]);

    constructor() {
        // Setting up a connection with the load balancer server
        this._client = new Client("ws:" + environment.loadBalancerUrl);
        this.listenForErrors();
        // Registering to the load balancer
        this._loadBalancerRoom = this._client.join("load-balancer");
        this._loadBalancerRoom.onJoin.addOnce(() => {
            this.errors.next([]);
            this.listenForServerChanges();
        });
    }

    ngOnDestroy() {
        this._loadBalancerRoom.leave();
        this._client.close();
        this.servers.complete();
        this.errors.complete();
    }

    private listenForServerChanges(): void {
        if (this._loadBalancerRoom && this._loadBalancerRoom.hasJoined) {
            this._loadBalancerRoom.onStateChange.add(() => {
                const servers = { ...this._loadBalancerRoom.state };
                const serverUrls = Object.keys(servers);

                for (const serverUrl of serverUrls) {
                    servers[serverUrl] = {
                        ...servers[serverUrl],
                        games: servers[serverUrl].games.map(game => ({
                            ...game,
                            serverUrl
                        }))
                    };
                }

                this.servers.next(servers);
            });
        }
    }

    private listenForErrors() {
        if (this._client) {
            this._client.onError.add(error => {
                const errorMessage = `Unable to communicate with load balancer located at ${environment.loadBalancerUrl}`;
                if (this.errors.value.find(e => e === errorMessage) === undefined) {
                    this.errors.next([...this.errors.value, errorMessage]);
                }
            });
        }
    }
}
