import { GameObject } from "./game-object";


export class Bomb extends GameObject {
    private readonly TIME_BEFORE_EXPLOSION = 2; // seconds
    private readonly EXPLOSION_DURATION = 1; // seconds


    constructor() {
        super();
        this.width = 16;
        this.height = 16;
    }
}
