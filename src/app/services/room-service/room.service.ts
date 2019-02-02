import { Injectable } from "@angular/core";
import { ServerManagerService } from "../server-manager";
import { BehaviorSubject } from "rxjs";
import { GameInfo } from "src/app/models";

@Injectable({
    providedIn: "root"
})
export class RoomService {
    rooms = new BehaviorSubject<GameInfo[]>([]);

    get errors(): BehaviorSubject<string[]> {
        return this._serverManagerService.errors;
    }

    constructor(private _serverManagerService: ServerManagerService) {
        this.updateRoomList();
    }

    updateRoomList(): void {
        this._serverManagerService.servers.subscribe(servers => {
            const serverArray = Object.values(servers);
            const rooms = serverArray.map(server => server.games).reduce( (acc, cur) => {
                return [...acc, ...cur];
            }, []);

            this.rooms.next(rooms);
        });
    }
}
