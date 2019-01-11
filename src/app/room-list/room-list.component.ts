import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from "@angular/core";
import { Client } from "colyseus.js";
import { RoomAvailable } from "colyseus.js/lib/Room";
import { interval, Subscription } from "rxjs";

@Component({
    selector: "bomberman-room-list",
    templateUrl: "./room-list.component.html",
    styleUrls: ["./room-list.component.css"]
})
export class RoomListComponent implements OnInit, OnDestroy {

    @Input()
    client: Client;
    @Input()
    idOfSelectedRoom: string;
    @Output()
    roomChange = new EventEmitter<RoomAvailable>();

    rooms: RoomAvailable[] = [];
    private _subscription: Subscription;

    constructor() {}

    ngOnInit() {
        this.updateRoomList();
        this._subscription = interval(5000).subscribe(() => this.updateRoomList());
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    onRoomClick(room: RoomAvailable) {
        this.roomChange.emit(room);
    }

    trackByRoomName(index: number, item: RoomAvailable): string {
        return item.roomId;
    }

    updateRoomList(): void {
        if (this.client) {
            this.client.getAvailableRooms("dci", (rooms, err) => {
                if (err) {
                    console.error(err);
                }
                else {
                    this.rooms = rooms;
                }
            });
        }
    }
}
