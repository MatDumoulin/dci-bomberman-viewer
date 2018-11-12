import { GameObject } from "./game-object";
import { Bomb } from "./bomb";

export class Tile {
    info: GameObject;
    bombs: Bomb[] = [];
    isOnFire = false;
    row: number;
    col: number;

    constructor(info: GameObject, row: number, col: number) {
        this.info = info;
        this.row = row;
        this.col = col;
    }
}

export const OUT_OF_BOUND: Tile = null;
