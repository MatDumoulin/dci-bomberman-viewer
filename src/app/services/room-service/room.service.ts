import { Injectable, OnDestroy } from "@angular/core";
import { RootServerService } from "../root-server";
import { BehaviorSubject } from "rxjs";
import { GameInfo } from "src/app/models";
import { RoomAvailable } from "colyseus.js/lib/Room";

@Injectable({
    providedIn: "root"
})
export class RoomService implements OnDestroy {
    private _interval: any;
    rooms = new BehaviorSubject<RoomAvailable[]>([]);

    get errors(): BehaviorSubject<string[]> {
        return this._rootServerService.errors;
    }

    constructor(private _rootServerService: RootServerService) {
        this.updateRoomList();
        this.resume();
    }

    ngOnDestroy() {
        clearInterval(this._interval);
    }

    pause() {
        clearInterval(this._interval);
    }

    get paused(): boolean {
        return !this._interval;
    }

    resume() {
        this._interval = setInterval(() => this.updateRoomList(), 2000);
    }

    updateRoomList(): void {
        this._rootServerService.client.getAvailableRooms("dci", (rooms, err) => {
            if (err) {
                console.log("Cannot refresh the room list: ", err);
            }
            else {
                this.rooms.next(rooms);
            }
        });
    }
}
