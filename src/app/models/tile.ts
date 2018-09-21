import { GameObject } from "./game-object";
import { Bomb } from "./bomb";

export class Tile {
    info: GameObject;
    bombs: Bomb[] = [];
    isOnFire = false;

    constructor(info: GameObject) {
        this.info = info;
    }
}

export const OUT_OF_BOUND: Tile = null;
