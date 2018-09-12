import { GameObject, ObjectType } from "./game-object";

export type PlayerId = string;

export class Player extends GameObject {
    animationFrame = 0;
    playerId: PlayerId;
    currentActions: PlayerAction;
    previousDirection: Direction = Direction.Down;

    // There is no point into creating a player with default values
    // since the viewer's only purpose is to show the state on the server.
    constructor(player: PlayerFromServer) {
        super();
        this.playerId = player.playerId;
        this.changeActions(player.actions);
        this.type = player.type;
        this.coordinates = player.coordinates;
        this.width = player.width;
        this.height = player.height;
    }

    changeActions(newActions: PlayerAction): void {
        this.animationFrame = 0; // reset the animation.
        this.currentActions = newActions;

        // Updating the direction of the player if he is moving.
        if (this.currentActions.move_right) {
            this.previousDirection = Direction.Right;
        } else if (this.currentActions.move_up) {
            this.previousDirection = Direction.Up;
        } else if (this.currentActions.move_down) {
            this.previousDirection = Direction.Down;
        } else if (this.currentActions.move_left) {
            this.previousDirection = Direction.Left;
        }
    }
}

export interface PlayerFromServer extends GameObject {
    playerId: PlayerId;
    actions: PlayerAction;
    type: ObjectType;
}

// Moves that the player can do.
export class PlayerAction {
    move_up = false;
    move_down = false;
    move_left = false;
    move_right = false;
    plant_bomb = false;
}

export enum Direction {
    Up,
    Down,
    Left,
    Right
}
