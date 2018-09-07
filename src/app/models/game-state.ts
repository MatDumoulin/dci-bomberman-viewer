import { GameMap } from "./game-map";

export interface GameState {
    gameId: string;
    gameMap: GameMap;
    players: any; // { [id: string]: Player };
    bombs: any[]; // Bomb[];
    // collectibles: Collectible[];
    paused: boolean;
    isOver: boolean;
    hasStarted: boolean;
}
