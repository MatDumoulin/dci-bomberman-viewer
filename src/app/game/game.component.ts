import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { SocketService } from "../socket/socket.service";

import { GameEngineService } from "./game-engine/game-engine.service";
import { GameMapManagerService } from "./game-map-manager/game-map-manager.service";
import { GameState, GameStateFromServer } from "../models/game-state";
import { PlayerManagerService } from "./player-manager/player-manager.service";
import { Player } from "../models/player";

@Component({
    selector: "bomberman-game",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"]
})
export class GameComponent implements OnInit, OnDestroy {
    private _subscriptions: Subscription[] = [];
    private _currentGameState: GameState;
    private readonly TICKS_PER_REFRESH = 4; // Game is running at 15 FPS.
    private _currentTick = 0;
    errors: string[] = [];

    constructor(
        private _gameEngineService: GameEngineService,
        private _gameMapManagerService: GameMapManagerService,
        private _playerManagerService: PlayerManagerService,
        private _route: ActivatedRoute,
        private _socketService: SocketService
    ) {}

    ngOnInit(): void {
        this._subscriptions.push(
            this._socketService.errors.subscribe(errors => {
                if (!errors) {
                    this.errors = [];
                }
                else if (!this.errors.includes(errors)) {
                    this.errors.push(errors);
                }
            })
        );

        const serverUrl = this._route.snapshot.paramMap.get("serverUrl");
        console.log("Server url: ", serverUrl);
        this._socketService.connect(serverUrl).then( () => this.onSocketConnectionSetUp());
    }

    ngOnDestroy(): void {
        this._socketService.disconnect();

        for (const sub of this._subscriptions) {
            sub.unsubscribe();
        }
    }

    onSocketConnectionSetUp(): void {
        this._socketService.on("viewingGame", (gameState: GameStateFromServer) => {
            console.log("We are now viewing the game.");
            // Here we want to init the state of the game with the one given by the server.
            const initializedPlayers = this.initPlayers(gameState);

            this._currentGameState = {
                ...gameState,
                players: initializedPlayers
            };

            this._currentTick = 0;
            this.drawLoop();
        });

        this._socketService.on("StateChanged", (gameState: GameStateFromServer) => {
            // Here we want to update the current game state to match the new state.
            // For some objects, we are storing useful information that we don't want to lose.
            const updatedPlayers = this.updatePlayerActions(gameState);

            this._currentGameState = {
                ...gameState,
                players: updatedPlayers
            };
        });
    }

    private drawLoop(): void {

        window.requestAnimationFrame(this.drawLoop.bind(this));
        this._currentTick++;

        if (this._currentTick === this.TICKS_PER_REFRESH) {
            this.draw(this._currentGameState);
            this._currentTick = 0;
        }
    }

    private async draw(gameState: GameState): Promise<void> {
        // First of, we clear the canvas.
        this.clearCanvas();
        // Then, we draw our current state.
        const ctx = this.getCanvasContext();
        // Awaits and promises are used since the draw order determines the z-index on the canvas.
        // Thus, we got to keep a clear draw order.
        await this._gameMapManagerService.drawMap(ctx, gameState.gameMap);

        const playerIds = Object.keys(gameState.players);

        for (let i = 0; i < playerIds.length; ++i) {
            const player = gameState.players[playerIds[i]];
            await this._playerManagerService.drawPlayer(ctx, player);
        }
    }

    private clearCanvas(): void {
        const canvas = this.getCanvas();
        const ctx = this.getCanvasContext();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    private updatePlayerActions(newState: GameStateFromServer): {[playerId: string]: Player} {
        const players: {[playerId: string]: Player} = {};
        const playerIds = Object.keys(newState.players);

        for (const playerId of playerIds) {
            const playerFromCurrentState = this._currentGameState.players[playerId];
            const playerFromNewState = newState.players[playerId];
            // Updating our player reference.
            playerFromCurrentState.changeActions(playerFromNewState.actions);
            players[playerId] = playerFromCurrentState;
        }

        return players;
    }

    private initPlayers(newState: GameStateFromServer): {[playerId: string]: Player} {
        const players: {[playerId: string]: Player} = {};
        const playerIds = Object.keys(newState.players);

        for (const playerId of playerIds) {
            const player = newState.players[playerId];
            players[playerId] = new Player(player);
        }

        return players;
    }

    private getCanvasContext(): CanvasRenderingContext2D {
        const canvas = this.getCanvas();

        if (!canvas || !canvas.getContext) {
            const errorMessage = "Unable to access the game canvas.";
            this.errors.push(errorMessage);
            console.error(errorMessage);
            return null;
        }

        return canvas.getContext('2d');
    }

    private getCanvas(): HTMLCanvasElement {
        return document.getElementById("bomberman-game") as HTMLCanvasElement;
    }
}
