import { GameObject, ObjectType } from "./game-object";
import { PlayerId } from "./player";

export class Bomb extends GameObject {
    private readonly TIME_BEFORE_EXPLOSION = 2; // seconds
    private readonly EXPLOSION_DURATION = 1; // seconds
    type: ObjectType;
    id: number;
    plantedBy: PlayerId;
    plantedAt: number;
    row: number;
    col: number;

    constructor() {
        super();
        this.width = 16;
        this.height = 16;
    }
}
