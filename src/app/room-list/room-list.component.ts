import { Component, Input, Output, EventEmitter } from "@angular/core";
import { RoomAvailable } from "colyseus.js/lib/Room";
import { GameInfo } from "../models";


@Component({
    selector: "bomberman-room-list",
    templateUrl: "./room-list.component.html",
    styleUrls: ["./room-list.component.css"]
})
export class RoomListComponent {
    @Input()
    idOfSelectedRoom: string;

    @Input()
    rooms: RoomAvailable[] = [];

    @Output()
    roomChange = new EventEmitter<RoomAvailable>();

    constructor() {}

    onRoomClick(room: RoomAvailable) {
        this.roomChange.emit(room);
    }

    trackByRoomName(index: number, item: RoomAvailable): string {
        return item.roomId;
    }
}
