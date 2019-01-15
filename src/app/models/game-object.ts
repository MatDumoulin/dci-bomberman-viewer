import { Point } from "./point";

export enum ImageLocation {
    breakable = "assets/box.png",
    walkable = "assets/test.png",
    wall = "assets/wall.png",
    collectibles = "",
    player = "assets/chicken.png",
    bomb = "assets/bomb.png",
    explosion = "assets/explosion.png",
    powerUp = "assets/power-up.png",
    bombUp = "assets/bomb-up.png",
    speedUp = "assets/speed-up.png"
}

export enum ObjectType {
    Wall = "WALL",
    Walkable = "WALKABLE",
    BreakableItem = "BREAKABLE",
    Player = "PLAYER",
    Bomb = "BOMB",
    PowerUp = "POWER-UP",
    SpeedUp = "SPEED-UP",
    BombUp = "BOMB-UP"
}

/** Any object that can be displayed on the map has these properties. */
export class GameObject {
    type: ObjectType;
    coordinates: Point;
    width: number;
    height: number;
}
