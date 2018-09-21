import { Tile } from "./tile";

export interface GameMap {
    _tiles: Tile[][];
    _tileWidth: number; /** In pixels */
    _tileHeight: number; /** In pixels */
}
