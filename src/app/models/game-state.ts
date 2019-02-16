import { GameMap } from "./game-map";
import { PlayerFromServer, Player, PlayerId } from "./player";
import { Upgrade } from "./upgrade";

export interface GameState {
    gameId: string;
    gameMap: GameMap;
    players: { [id: string]: Player };
    collectibles: Upgrade[];
    paused: boolean;
    isOver: boolean;
    hasStarted: boolean;
    time: number;
    maxTime: number;
    winner: PlayerId;
}

export interface GameStateFromServer {
    gameId: string;
    gameMap: GameMap;
    players: { [id: string]: PlayerFromServer };
    collectibles: Upgrade[];
    paused: boolean;
    isOver: boolean;
    hasStarted: boolean;
    time: number;
    maxTime: number;
    winner: PlayerId;
}
