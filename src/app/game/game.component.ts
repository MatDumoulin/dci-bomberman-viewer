import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { SocketService } from "../socket/socket.service";

import { GameEngineService } from "./game-engine/game-engine.service";
import { GameMapManagerService } from "./game-map-manager/game-map-manager.service";
import { GameState, GameStateFromServer } from "../models/game-state";
import { PlayerManagerService } from "./player-manager/player-manager.service";
import { Player, PlayerAction } from "../models/player";

@Component({
    selector: "bomberman-game",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"]
})
export class GameComponent implements OnInit, OnDestroy {
    private readonly TICKS_PER_REFRESH = 4; // Game is running at 15 FPS.
    private _isListeningToSocket = false;
    private _subscriptions: Subscription[] = [];
    private _currentGameState: GameState;
    private _currentTick = 0;
    private _isViewingGame = false;
    errors: string[] = [];
    hasJoinedGame = false;
    private _previousActions: PlayerAction;

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
                } else if (!this.errors.includes(errors)) {
                    this.errors.push(errors);
                }
            })
        );

        const serverUrl = this._route.snapshot.paramMap.get("serverUrl");
        console.log("Server url: ", serverUrl);
        this._socketService
            .connect(serverUrl)
            .then(() => this.onSocketConnectionSetUp());
    }

    ngOnDestroy(): void {
        this._socketService.disconnect();

        for (const sub of this._subscriptions) {
            sub.unsubscribe();
        }
    }

    onSocketConnectionSetUp(): void {
        if (!this._isListeningToSocket) {
            this._isListeningToSocket = false;
            this._socketService.on(
                "viewingGame",
                (gameState: GameStateFromServer) => {
                    console.log("We are now viewing the game.");
                    // Here we want to init the state of the game with the one given by the server.
                    const initializedPlayers = this.initPlayers(gameState);

                    this._currentGameState = {
                        ...gameState,
                        players: initializedPlayers
                    };

                    this._isViewingGame = true;
                    this._currentTick = 0;
                    this.drawLoop();
                }
            );

            this._socketService.on(
                "StateChanged",
                (gameState: GameStateFromServer) => {
                    // Skip this if the player is not yet viewing the game.
                    if (!this._isViewingGame) {
                        return;
                    }

                    // Here we want to update the current game state to match the new state.
                    // For some objects, we are storing useful information that we don't want to lose.
                    const updatedPlayers = this.updatePlayerState(gameState);

                    this._currentGameState = {
                        ...gameState,
                        players: updatedPlayers
                    };
                }
            );
        }
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

    private updatePlayerState(
        newState: GameStateFromServer
    ): { [playerId: string]: Player } {
        const players: { [playerId: string]: Player } = {};
        const playerIds = Object.keys(newState.players);

        for (const playerId of playerIds) {
            const playerFromCurrentState = this._currentGameState.players[
                playerId
            ];
            const playerFromNewState = newState.players[playerId];

            if (playerFromCurrentState) {
                // Updating our player reference.
                playerFromCurrentState.changeState(playerFromNewState);
                players[playerId] = playerFromCurrentState;
            }
            // If the player is not in our state, add him.
            else {
                const newPlayer = new Player(playerFromNewState);
                players[playerId] = newPlayer;
            }
        }

        return players;
    }

    private initPlayers(
        newState: GameStateFromServer
    ): { [playerId: string]: Player } {
        const players: { [playerId: string]: Player } = {};
        const playerIds = Object.keys(newState.players);

        for (const playerId of playerIds) {
            const player = newState.players[playerId];
            players[playerId] = new Player(player);
        }

        return players;
    }

    /*     private initGameState(gameState: GameStateFromServer): void {

    } */

    private getCanvasContext(): CanvasRenderingContext2D {
        const canvas = this.getCanvas();

        if (!canvas || !canvas.getContext) {
            const errorMessage = "Unable to access the game canvas.";
            this.errors.push(errorMessage);
            console.error(errorMessage);
            return null;
        }

        return canvas.getContext("2d");
    }

    private getCanvas(): HTMLCanvasElement {
        return document.getElementById("bomberman-game") as HTMLCanvasElement;
    }

    // To play the game
    joinGame(): void {
        this._socketService.emit("joinGame", "mathieu");
        this._socketService.on("GameJoined", () => {
            this.hasJoinedGame = true;
        });
    }

    leaveGame(): void {
        this._socketService.emit("leaveGame");
        this.hasJoinedGame = false;
    }

    onActionInput(event: KeyboardEvent): void {
        if (this.hasJoinedGame) {

            let actions: PlayerAction;

            if (this._previousActions) {
                actions = new PlayerAction();
            }
            else {
                actions = Object.assign({}, this._previousActions);
            }

            const isKeyDown = event.type === "keydown";

            if (event.key === "ArrowUp") {
                actions.move_up = isKeyDown;
            } else if (event.key === "ArrowDown") {
                actions.move_down = isKeyDown;
            } else if (event.key === "ArrowLeft") {
                actions.move_left = isKeyDown;
            } else if (event.key === "ArrowRight") {
                actions.move_right = isKeyDown;
            }

            if (event.key === " ") {
                actions.plant_bomb = isKeyDown;
                console.log(actions.plant_bomb);
            }

            // Verify if actions have changed
            const hasChanged =
                !this._previousActions ||
                this._previousActions.move_down !== actions.move_down ||
                this._previousActions.move_up !== actions.move_up ||
                this._previousActions.move_left !== actions.move_left ||
                this._previousActions.move_right !== actions.move_right ||
                this._previousActions.plant_bomb !== actions.plant_bomb;

            this._previousActions = actions;

            if (hasChanged) {
                this._socketService.emit("PlayerAction", {playerId: "mathieu", actions});
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.hasJoinedGame) {
            const actions = Object.assign({}, this._previousActions);

            if (event.key === "ArrowUp") {
                actions.move_up = false;
            } else if (event.key === "ArrowDown") {
                actions.move_down = false;
            } else if (event.key === "ArrowLeft") {
                actions.move_left = false;
            } else if (event.key === "ArrowRight") {
                actions.move_right = false;
            }

            // Verify if actions have changed
            const hasChanged =
                !this._previousActions ||
                this._previousActions.move_down !== actions.move_down ||
                this._previousActions.move_up !== actions.move_up ||
                this._previousActions.move_left !== actions.move_left ||
                this._previousActions.move_right !== actions.move_right;

            this._previousActions = actions;

            if (hasChanged) {
                this._socketService.emit("PlayerAction", {playerId: "mathieu", actions});
            }
        }
    }
}
