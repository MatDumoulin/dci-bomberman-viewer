import { GameMap } from "./game-map";
import { PlayerFromServer, Player, PlayerId } from "./player";

export interface GameState {
    gameId: string;
    gameMap: GameMap;
    players: { [id: string]: Player };
    // collectibles: Collectible[];
    paused: boolean;
    isOver: boolean;
    hasStarted: boolean;
    time: number;
    winner: PlayerId;
}

export interface GameStateFromServer {
    gameId: string;
    gameMap: GameMap;
    players: { [id: string]: PlayerFromServer };
    // collectibles: Collectible[];
    paused: boolean;
    isOver: boolean;
    hasStarted: boolean;
    time: number;
    winner: PlayerId;
}
