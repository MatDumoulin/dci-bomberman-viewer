import { Point } from "./point";

export enum ImageLocation {
    breakable = "assets/box.png",
    walkable = "assets/test.png",
    wall = "assets/wall.png",
    collectibles = "",
    player = "assets/cat-sprite.png"
}

export enum ObjectType {
    Wall = "WALL",
    Walkable = "WALKABLE",
    BreakableItem = "BREAKABLE",
    Player = "PLAYER",
    Collectible = "COLLECTIBLE",
    Bomb = "BOMB"
}

/** Any object that can be displayed on the map has these properties. */
export interface GameObject {
    type: ObjectType;
    coordinates: Point;
    width: number;
    height: number;
}
