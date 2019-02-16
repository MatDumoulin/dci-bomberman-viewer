import { Tile } from "./tile";

export interface GameMap {
    _tiles: Tile[][];
    height: number;
    width: number;
}
