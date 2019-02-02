import { Component, OnInit, OnDestroy } from "@angular/core";
import { Client, Room, DataChange } from "colyseus.js";
import uuid from "uuid/v4";

import { GameMapManagerService } from "./game-map-manager/game-map-manager.service";
import {
    GameState,
    GameStateFromServer,
    Player,
    PlayerAction,
    PlayerId,
    ClientOptions,
    GameInfo
} from "../models";
import { PlayerManagerService } from "./player-manager/player-manager.service";
import { Message } from "../comm";
import { RoomService } from "../services/room-service/room.service";
import { Subscription } from "rxjs";

enum ErrorTypes {
    LOAD_BALANCER = "load-balancer",
    USER_INPUT = "user",
    GAME = "game"
}

@Component({
    selector: "bomberman-game",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"]
})
export class GameComponent implements OnInit, OnDestroy {
    private _currentServerUrl: string;
    private _room: Room;
    private _isViewingGame = false;
    private _previousActions: PlayerAction;
    private _playerId: string;
    private _viewerId: string = uuid();
    private _autoJoinFirstGameSubscription: Subscription;
    client: Client;
    userId: string;
    roomToView: string;
    currentGameState: GameState;
    errors: {reason: string, error: string}[] = [];
    hasJoinedGame = false;

    constructor(
        private _gameMapManagerService: GameMapManagerService,
        private _playerManagerService: PlayerManagerService,
        public roomService: RoomService
    ) {}

    ngOnInit(): void {
        this._autoJoinFirstGameSubscription = this.roomService.rooms.subscribe(
            rooms => {
                // Join the first room available, then unsubscribe.
                if (rooms.length > 0) {
                    this.updateSelectedRoom(this.roomService.rooms.value[0]);
                    if (this._autoJoinFirstGameSubscription) {
                        this._autoJoinFirstGameSubscription.unsubscribe();
                    }
                }
                this.errors = this.errors.filter(error => error.reason !== ErrorTypes.LOAD_BALANCER);
            }
        );

        this.roomService.errors.subscribe(roomErrors => {
            for (const roomError of roomErrors) {
                if (!this.errors.some(e => e.error === roomError)) {
                    this.errors.push({reason: ErrorTypes.LOAD_BALANCER, error: roomError});
                }
            }
        });
    }

    ngOnDestroy(): void {
        if (this._room && this._room.hasJoined) {
            this._room.leave();
        }

        if (this.client && this.client.id !== null) {
            this.client.close();
        }
    }

    onSocketConnectionSetUp(): void {
        // We begin by removing all listeners to prevent listener stacking.
        this._room.onJoin.removeAll();
        this._room.onStateChange.removeAll();
        this.client.onError.removeAll();

        // Then, we subscribe to the events that we want.
        this._room.onJoin.add(() => {
            console.log(this.client.id, "joined", this._room.name);

            if (!this._isViewingGame) {
                this.hasJoinedGame = true;
            }
        });

        this._room.onStateChange.addOnce(() => {
            console.log("First state change");
            this.roomToView = this._room.id;
            this.initGameState(this._room.state);
        });

        this._room.onStateChange.add(() => {
            // If the game state was initialized previously, colyseus will trigger it immediatly.
            // Ignore it since our init state will be called.
            if (!this.currentGameState) {
                return;
            }

            this.updateState(this._room.state);
        });

        this._room.listen("winner", (change: DataChange) => {
            if (change.value !== null) {
                console.log("Player ", change.value, " has won!");
            }
        });

        this.client.onError.add(roomError => {
            console.log("An error occurred in the room:", roomError);
            const errorMessage =
                "Unable to connect to game with url " +
                this._currentServerUrl;

            if (this.errors.findIndex(e => e.error === errorMessage) === -1) {
                this.errors.push({reason: ErrorTypes.GAME, error: errorMessage});
            }
        });
    }

    private async draw(gameState: GameState): Promise<void> {
        // First of, we clear the canvas.
        this.clearCanvas();
        // Then, we draw our current state.
        const ctx = this.getCanvasContext();
        // Awaits and promises are used since the draw order determines the z-index on the canvas.
        // Thus, we got to keep a clear draw order.
        await this._gameMapManagerService.drawMap(ctx, gameState.gameMap);
        await this._gameMapManagerService.drawCollectibles(ctx, gameState);
        await this._gameMapManagerService.drawBombsAndExplosions(
            ctx,
            gameState.gameMap
        );

        const playerIds = Object.keys(gameState.players);

        for (let i = 0; i < playerIds.length; ++i) {
            const player = gameState.players[playerIds[i]];

            if (player.isAlive) {
                await this._playerManagerService.drawPlayer(ctx, player);
            }
        }

        if (this.currentGameState.winner) {
            this.drawWinnerScreen(this.currentGameState.winner);
        }
    }

    private clearCanvas(): void {
        const canvas = this.getCanvas();
        const ctx = this.getCanvasContext();

        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    private updateState(gameState: GameStateFromServer) {
        // Here we want to update the current game state to match the new state.
        // For some objects, we are storing useful information that we don't want to lose.
        const updatedPlayers = this.updatePlayerState(gameState);

        this.currentGameState = {
            ...gameState,
            players: updatedPlayers
        };

        this.draw(this.currentGameState);
    }

    private updatePlayerState(
        newState: GameStateFromServer
    ): { [playerId: string]: Player } {
        const players: { [playerId: string]: Player } = {};
        const playerIds = Object.keys(newState.players);

        for (const playerId of playerIds) {
            const playerFromCurrentState = this.currentGameState.players[
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

    private initGameState(gameState: GameStateFromServer) {
        // Here we want to init the state of the game with the one given by the server.
        const initializedPlayers = this.initPlayers(gameState);

        this.currentGameState = {
            ...gameState,
            players: initializedPlayers
        };

        this._isViewingGame = true;
        this.errors = [];
        this.draw(this.currentGameState);
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

    private getCanvasContext(): CanvasRenderingContext2D {
        const canvas = this.getCanvas();

        if (!canvas || !canvas.getContext) {
            const errorMessage = "Unable to access the game canvas.";
            this.errors.push({reason: ErrorTypes.GAME, error: errorMessage});
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
        if (!this.userId) {
            this.errors.push(
                {reason: ErrorTypes.USER_INPUT, error: "L'identifiant de l'utilisateur ne peut pas être vide, you hacker."}
            );
            this.userId = "";
            return;
        } else if (!this.userId.trim()) {
            this.errors.push({reason: ErrorTypes.USER_INPUT, error: "Don't try to fool me with your whitespaces!"});
            this.userId = "";
            return;
        }

        // First, we need to leave the room since we are automatically registered as a viewer.
        this.leaveGame();
        this._isViewingGame = false;
        this._playerId = this.userId;

        // Then, we can connect to the game as a player.
        const clientOptions: ClientOptions = {
            isPlaying: true,
            id: this._playerId
        };

        if (this.roomToView) {
            clientOptions.roomToJoin = this.roomToView;
        }

        this._room = this.client.join("dci", clientOptions);
        this.onSocketConnectionSetUp();
    }

    leaveGame(): void {
        if (this._room) {
            this._room.leave();
        }
        this._room = null;
        this.hasJoinedGame = false;
        this._isViewingGame = true;
        this.currentGameState = null;
        this.clearCanvas();
    }

    onActionInput(event: KeyboardEvent): void {
        if (this.hasJoinedGame) {
            let actions: PlayerAction;

            if (this._previousActions) {
                actions = new PlayerAction();
            } else {
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
                this._room.send(
                    new Message("PlayerAction", {
                        playerId: this._playerId,
                        actions
                    })
                );
            }
        }
    }

    getGameTime() {
        if (!this.currentGameState) {
            return null;
        }
        // Minutes:Seconds
        return `${Math.floor(this.currentGameState.time / 60000)}:${Math.floor(
            this.currentGameState.time / 1000
        ) % 60}`;
    }

    private drawWinnerScreen(playerId: PlayerId) {
        const ctx = this.getCanvasContext();
        const canvas = this.getCanvas();

        if (ctx) {
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1.0;

            ctx.font = "24px Marker Felt, fantasy";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(
                `Player ${playerId} has won!`,
                canvas.width / 2,
                150,
                canvas.width
            );
        }
    }

    hasGameStarted(): boolean {
        return this.currentGameState && this.currentGameState.hasStarted;
    }

    updateSelectedRoom(newRoomToSelect: GameInfo): void {
        if (newRoomToSelect.id !== this.roomToView) {
            this.roomToView = newRoomToSelect.id;

            // Switching up the game that is watched by the user.
            if (this._room) {
                this.leaveGame();
            }
            // Changing up the colyseus client if we are watching a game on another server.
            if (this._currentServerUrl !== newRoomToSelect.serverUrl) {
                if (this.client && this.client.id) {
                    this.client.close();
                }
                this.client = new Client("ws:" + newRoomToSelect.serverUrl);
                this._currentServerUrl = newRoomToSelect.serverUrl;
            }

            // Join the game
            this._isViewingGame = true;
            const clientOptions: ClientOptions = {
                isPlaying: false,
                id: this._viewerId
            };
            if (this.roomToView) {
                clientOptions.roomToJoin = this.roomToView;
            }
            this._room = this.client.join("dci", clientOptions);
            this.onSocketConnectionSetUp();
        }
    }
}
