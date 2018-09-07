export type PlayerId = string;

export class Player {
    previousActions: PlayerAction;
    playerId: PlayerId;
    currentActions: PlayerAction;

    constructor(info: PlayerInfo) {
        this.playerId = info.playerId;
    }

    changeActions(newActions: PlayerAction): void {
        this.previousActions = this.currentActions;
        this.currentActions = newActions;
    }
}

export interface PlayerInfo {
    playerId: PlayerId;
    actions: PlayerAction;
}

// Moves that the player can do.
export class PlayerAction {
    move_up = false;
    move_down = false;
    move_left = false;
    move_right = false;
    plant_bomb = false;
}
