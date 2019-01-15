import { GameObject, ObjectType } from "./game-object";
import { Tile } from "./tile";

export const UPGRADE_DROP_RATE = 0.2;

export interface Upgrade extends GameObject {
    row: number;
    col: number;
}
