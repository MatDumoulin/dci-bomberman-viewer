import { GameObject } from "./game-object";

export interface GameMap {
    _tiles: GameObject[][];
    _tileWidth: number; /** In pixels */
    _tileHeight: number; /** In pixels */
}
