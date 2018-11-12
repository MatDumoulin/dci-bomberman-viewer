import { GameObject, ObjectType } from "./game-object";
import { Bomb } from "./bomb";

export type PlayerId = string;

export class Player extends GameObject {
    animationFrame = 0;
    playerId: PlayerId;
    isAlive: boolean;
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
        this.isAlive = player.isAlive;
    }

    changeActions(newActions: PlayerAction): void {
        // If the new actions are falsy (invalid), do nothing.
        if (!newActions) {
            return;
        }

        // First, I check if the new actions are the same as the current ones.
        // If not, update the actions.
        if (
            !this.currentActions ||
            this.currentActions.move_right !== newActions.move_right ||
            this.currentActions.move_up !== newActions.move_up ||
            this.currentActions.move_down !== newActions.move_down ||
            this.currentActions.move_left !== newActions.move_left
        ) {
            this.animationFrame = 0; // reset the animation.
            this.currentActions = newActions;
        }

        // Then, we check for the direction that the player is facing.
        // This is needed to draw the player's sprite.
        if (this.currentActions.move_right) {
            this.previousDirection = Direction.Right;
        } else if (this.currentActions.move_up) {
            this.previousDirection = Direction.Up;
        } else if (this.currentActions.move_down) {
            this.previousDirection = Direction.Down;
        } else if (this.currentActions.move_left) {
            this.previousDirection = Direction.Left;
        }
        // If the player is not moving, reset his animation so that
        // his character is not moving while idle.
        else {
            this.animationFrame = 0;
        }
    }

    changeState(newState: PlayerFromServer): void {
        this.changeActions(newState.actions);
        this.coordinates = newState.coordinates;
        this.isAlive = newState.isAlive;
    }

    animate(): void {
        if (
            this.currentActions &&
            (this.currentActions.move_right ||
                this.currentActions.move_up ||
                this.currentActions.move_down ||
                this.currentActions.move_left)
        ) {
            ++this.animationFrame;
        } else {
            this.animationFrame = 0;
        }
    }
}

export interface PlayerFromServer extends GameObject {
    playerId: PlayerId;
    actions: PlayerAction;
    type: ObjectType;
    /** The amount of pixels that the player moves at every game tick */
    speed: number;
    /** Maximum number of bombs that the player can drop at a time. */
    maxBombCount: number;
    /** All the bombs currently in the map that were dropped by the player */
    bombs: Bomb[];
    isAlive: boolean;
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
